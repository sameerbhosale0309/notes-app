const supabase = require('../config/supabaseClient');
const fs = require('fs');
const NodeCache = require('node-cache');
const subjectsCache = new NodeCache({ stdTTL: 300 }); // cache for 300 seconds (5 minutes)

const getSubjects = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch subjects' });
  }
};

const getNotesBySubject = async (req, res) => {
  const subject = decodeURIComponent(req.params.subject);

  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('subject', subject)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch notes' });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch all notes' });
  }
};

const uploadNote = async (req, res) => {
  try {
    const { subject, title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'file is required' });
    }

    const file = req.file;
    const filePath = `notes/${Date.now()}-${file.originalname}`;

    const fileBuffer = fs.readFileSync(file.path);

    const { error: uploadError } = await supabase.storage
      .from('notes')
      .upload(filePath, fileBuffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.log('storage upload error:', uploadError);
      return res.status(500).json({ error: uploadError.message, source: 'storage' });
    }

    const { data: publicUrlData } = supabase.storage
      .from('notes')
      .getPublicUrl(filePath);

    const fileUrl = publicUrlData.publicUrl;

    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          subject,
          title,
          description,
          file_url: fileUrl,
          file_name: file.originalname,
          file_path: filePath,
        },
      ])
      .select();

    fs.unlinkSync(file.path);

    if (error) {
      console.log('db insert error:', error);
      return res.status(500).json({ error: error.message, source: 'database' });
    }

    res.status(201).json({
      message: 'note uploaded successfully',
      note: data[0],
    });
  } catch (err) {
    res.status(500).json({ error: 'failed to upload note' });
  }
};

const deleteNote = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    console.log('delete request id:', id);

    const { data: note, error: fetchError } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      console.log('fetch error:', fetchError);
      return res.status(500).json({ error: fetchError.message });
    }

    if (!note) {
      return res.status(404).json({ error: 'note not found' });
    }

    console.log('note found:', note);

    if (note.file_path) {
      const { error: storageError } = await supabase.storage
        .from('notes')
        .remove([note.file_path]);

      if (storageError) {
        console.log('storage delete error:', storageError);
      }
    }

    const { error: deleteError, count } = await supabase
      .from('notes')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (deleteError) {
      console.log('delete error:', deleteError);
      return res.status(500).json({ error: deleteError.message });
    }

    console.log('deleted count:', count);

    const { data: checkNote } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id);

    console.log('after delete check:', checkNote);

    res.status(200).json({
      message: 'note deleted successfully',
      deleted_count: count,
      remaining_match: checkNote,
    });
  } catch (err) {
    console.log('server delete error:', err);
    res.status(500).json({ error: 'failed to delete note' });
  }
};

module.exports = {
  getSubjects,
  getNotesBySubject,
  getAllNotes,
  uploadNote,
  deleteNote,
};
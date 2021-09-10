import React, { useState, useEffect } from "react";
import "./App.css";
import { API, Storage } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";

const initialFormState = { name: "", description: "" };

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  async function myFetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const image = await Storage.get(note.image);
          note.image = image;
        }
        return note;
      })
    );
    setNotes(apiData.data.listNotes.items);
  }

  async function onChange(e) {
    if (!e.target.files[0]) {
      return;
    }
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name, name: file.name });
    await Storage.put(file.name, file);
    myFetchNotes();
  }

  useEffect(() => {
    myFetchNotes();
  }, []);

  async function myCreateNote() {
    if (!formData.name || !formData.description) {
      console.log("no name or description");
      return;
    }

    await API.graphql({
      query: createNoteMutation,
      variables: { input: formData },
    });

    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setNotes([...notes, formData]);
    setFormData(initialFormState);
  }

  async function myDeleteNote({ id }) {
    const newNotesArray = notes.filter((note) => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  return (
    <div className='App'>
      <h1>My Notes App</h1>
      <input
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder='Note name'
        value={formData.name}
      />
      <input type='file' onChange={onChange} />
      <input
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        placeholder='Note description'
        value={formData.description}
      />
      <button onClick={myCreateNote}>Create Note</button>
      <div style={{ marginBottom: 30 }}>
        {notes.map((note) => (
          <div key={note.id || note.name}>
            <h2>{note.name}</h2>
            <p>{note.description}</p>
            <button
              onClick={() => {
                myDeleteNote(note);
              }}>
              Delete note
            </button>
            {note.image && (
              <img alt='note' src={note.image} style={{ width: 400 }} />
            )}
          </div>
        ))}
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);

"use client";
import React, { useState } from 'react';
import { BaseUrl } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Fonction pour poster un commentaire
const postComment = async ({ postId, content, pseudo }) => {
  const response = await fetch(BaseUrl() + '/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        content,
        pseudo,
        post: postId,  // Assure que Strapi lie le commentaire au post via l'ID du post
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de l\'ajout du commentaire');
  }

  return response.json();
};

const Comments = ({ postId, comments }) => {
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [pseudo, setPseudo] = useState('');

  // Mutation pour poster un commentaire
  const mutation = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      queryClient.invalidateQueries(['post', postId]); // Rafraîchir les données du post après l'ajout d'un commentaire
      setContent('');
      setPseudo('');
    },
  });

  // Gestionnaire de soumission du formulaire
  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({ postId, content, pseudo });
  };

  return (
    <div className='mt-4 bg-[#27272c] p-12 rounded-xl flex flex-col  items-center justify-between gap-12 mb-12'>
      <div className='flex flex-col gap-4 w-[40%]'>
                <h3 className='text-lg text-white/90 font-semibold'>Derniers commentaires :</h3>
                <ul className='list-disc pl-5'>
                    {comments.map(comment => (
                    <li key={comment.id} className='mt-2'>
                        <p className='text-sm text-white/80'>{comment.attributes.content}</p>
                        <span className='text-xs text-white/40'>Posté par {comment.attributes.pseudo}</span>
                    </li>
        ))}
      </ul>
      </div>

      {/* Formulaire pour ajouter un nouveau commentaire */}
      <form onSubmit={handleSubmit} className='w-[40%]'>
        <div className='flex flex-col gap-2'>
          <input
            type='text'
            placeholder='Votre nom'
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            className='px-3 py-2 rounded bg-primary text-white xl:w-[100%]'
            required
          />
          <textarea
            placeholder='Votre commentaire...'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className='px-3 py-2 rounded bg-primary text-white xl:w-[100%]'
            required
          />
          <button
            type='submit'
            className='px-3 py-2 rounded bg-accent/30  hover:bg-accent/90 text-white/60 hover:text-white/90 mt-2 xl:w-[100%]'
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Envoi...' : 'Ajouter un commentaire'}
          </button>
        </div>
        {mutation.isError && <p className='text-red-500 mt-2'>Erreur lors de l'ajout du commentaire.</p>}
      </form>

      
    </div>
  );
};

export default Comments;

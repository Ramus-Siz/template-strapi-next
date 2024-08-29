// components/Posts.js
"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// Fonction pour récupérer les données des posts depuis l'API Strapi
const fetchPosts = async () => {
  const response = await fetch('http://localhost:1337/api/posts');
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des données');
  }

  const data = await response.json();
  return data;
};

function Posts() {
  const { data, error, isLoading, isError } = useQuery({
    queryFn: async () => await fetchPosts(),
    queryKey: ['posts'],
    });
  
  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur: {error.message}</div>;

  return (
    <div >
      <h1 className='text-3xl font-bold text-accent'>Liste des Posts</h1>
      <ul>
        {data.data.map(post => (
                <div key={post.id}>
                    <li >
                        <h2 className='text-2xl font-semibold text-accent'>{post.attributes.title}</h2>
                        <p className='text-lg text-white/60'>{post.attributes.content}</p>
                    </li>

                </div>
          
        ))}
      </ul>
    </div>
  );
}

export default Posts;

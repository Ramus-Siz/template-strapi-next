// components/Posts.js
"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BaseUrl, formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';


// Fonction pour récupérer les données des posts depuis l'API Strapi
const fetchPosts = async () => {
  const response = await fetch('http://localhost:1337/api/posts?populate[image]=*&populate[comments]=*');
  
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
  
  if (isLoading) return (
        <div className="flex flex-col xl:flex-row space-y-3">
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        </div>
  )
  if (isError) return <div>Erreur: {error.message}</div>;

  return (
    <div className='mt-10 container mx-auto '>
      <ul className='flex flex-col gap-4 items-center justify-between'>
        {data.data.map(post => (
            <Link key={post.id} href={`/posts/${post.id}`} className=''>
                 <div  className='flex items-center justify-center ' >
                    
                    <li className='flex flex-col-reverse xl:flex-row gap-4 items-center justify-start overscroll-auto'>
                        <div className='xl:w-[700px]'>
                            <span className='text-accent bg-accent/10 px-3 py-1 rounded-full text-sm'>Tech</span>
                            <h2 className='text-2xl font-semibold text-accent text-lg'>{post.attributes.title}</h2>
                            <p className='text-base text-white/60'>{post.attributes.description}</p>
                            <div className='flex gap-2 text-white/40 mt-2'>
                            {post.attributes.comments.data && post.attributes.comments.data.length > 0 ? (
                                <span className='text-sm'>{`${post.attributes.comments.data.length} comment(s)`}</span>

                            ) : (
                                <span className='text-sm'>0</span>
                            )}
                                <span className='text-sm'>{formatDate(post.attributes.createdAt)}</span>
                            </div>
                        </div>
                            {post.attributes.image.data && post.attributes.image.data.length > 0 && post.attributes.image.data[0].attributes.formats.thumbnail.url ? (
                                <img src={`${BaseUrl()}${post.attributes.image.data[0].attributes.formats.thumbnail.url}`} className="rounded-lg opacity-80" alt="" />
                            ) : (
                                <img src="../../no-image.png" className="rounded-lg w-[250px]" alt="" />
                            )}
                        
                    </li>

                </div>
            </Link>
               
          
        ))}
      </ul>
    </div>
  );
}

export default Posts;

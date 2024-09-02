"use client";

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { BaseUrl, formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import Comments from '@/components/comments';
import Header from '@/components/header';
import { useEffect } from 'react'; // Importer useEffect pour gérer l'état utilisateur côté client
import useUserStore from "@/lib/userStore"; // Importer Zustand store
import { useRouter } from "next/navigation"

// Fonction pour récupérer un seul post par ID
const fetchPostById = async (id) => {
  const response = await fetch(`http://localhost:1337/api/posts/${id}?populate[image]=*&populate[comments]=*`);

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des données');
  }

  const data = await response.json();
  return data;
};

const PostDetail = () => {
  const { id } = useParams(); // Obtenir l'ID de l'URL
  const { user, setUser, clearUser } = useUserStore(); // Utiliser Zustand pour gérer l'état utilisateur

  // Vérifiez si `id` est défini avant de faire la requête
  const { data, error, isLoading, isError } = useQuery({
    queryFn: async () => await fetchPostById(id),
    queryKey: ['post', id],
    enabled: !!id,
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchUser(token);
    }
  }, []);

  const router = useRouter();


  const fetchUser = async (token) => {
    const response = await fetch(`${BaseUrl()}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      setUser(userData); // Mettre à jour l'état utilisateur dans Zustand
    } else {
      localStorage.removeItem("authToken");
      clearUser(); // Réinitialiser l'état utilisateur dans Zustand
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    );

  if (isError) return <div>Erreur: {error.message}</div>;

  if (!data) return <div>Pas de données disponibles</div>;

  const post = data.data;
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    clearUser(); // Réinitialiser l'utilisateur dans le store Zustand
    router.push("/")
  };

  return (
    <>
      {/* Inclure le Header ici */}
      <Header user={user} onLogout={handleLogout} />

      <article className='container mx-auto'>
        <div className='flex items-center justify-center mt-12 w-full'>
          <li className='flex flex-col-reverse xl:flex-row'>
            <div>
              <div className='flex gap-4 items-center'>
                <span className='text-accent bg-accent/10 px-3 py-1 rounded-full text-sm'>Tech</span>
                <span className='text-sm text-white/40'>{formatDate(post.attributes.createdAt)}</span>
              </div>
              <div className='xl:w-[70%]'>
                <h2 className='text-2xl font-semibold text-accent/90 text-3xl'>{post.attributes.title}</h2>
                <p className='text-base text-white/60'>{post.attributes.description}</p>
              </div>
              <div className='flex items-center gap-2 text-white/40 mt-2'>
                {post.attributes.comments.data && post.attributes.comments.data.length > 0 && post.attributes.comments.data[0].attributes.pseudo ? (
                  <span className='text-sm'>Par <span className='text-white/60'>{`${post.attributes.comments.data[0].attributes.pseudo}`}</span></span>
                ) : (
                  <span className='text-sm'></span>
                )}
                <span className='text-white/60 text-sm'>{`${post.attributes.comments.data.length} `}<span className='text-white/40'>Commentaires</span></span>
              </div>
            </div>
            {post.attributes.image.data && post.attributes.image.data.length > 0 && post.attributes.image.data[0].attributes.formats.thumbnail.url ? (
              <img src={`${BaseUrl()}${post.attributes.image.data[0].attributes.formats.thumbnail.url}`} className="rounded-lg opacity-75 hover:opacity-100 z-0" alt="" />
            ) : (
              <img src="../../no-image.png" className="rounded-lg xl:w-[250px]" alt="" />
            )}
          </li>
        </div>
        <div className='flex items-center justify-center mt-12'>
          <p className='text-base text-white/60'>{post.attributes.content}</p>
        </div>
        <div className='overflow-x-auto'>
          <Comments postId={post.id} comments={post.attributes.comments.data} />
        </div>
      </article>
    </>
  );
};

export default PostDetail;

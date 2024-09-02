import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function BaseUrl(){
  const urlBase="http://localhost:1337";
  return urlBase;
}

export function homeUrl(){
  const urlHome="http://localhost:3001";
  return urlHome;
}




export function formatDate(isoDate) {
  // Convertir la date ISO en objet Date
  const date = new Date(isoDate);

  // Options pour formater la date
  const options = { month: 'short', day: 'numeric', year: 'numeric' };

  // Utiliser toLocaleDateString pour formater la date
  return date.toLocaleDateString('en-US', options);
}


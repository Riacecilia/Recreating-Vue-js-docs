import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
const docs =defineCollection({ 
	loader: docsLoader(), 
	schema: docsSchema() 
}),

export const collections = {docs};
	 
 
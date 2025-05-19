// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'My Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
				{
					label: 'essentials',
					items: [
        // Using `slug` for internal links.
        { label: 'class and style bindings', slug: 'essentials/class-and-style-bindings' },
        { label: 'form input bindings' , slug: 'essentials/form-input-bindings' },
		{ label: 'template syntax' , slug: 'essentials/template-syntax' }],
				},
				{
					label: 'getting started',
					 items: [
        // Using `slug` for internal links.
        { label: 'introduction' , slug: 'getting-started/introduction' },
        { label: 'quick start' , slug: 'getting-started/quick-start' }],
				},
				{
					label: 'reusability',
					items: [
        // Using `slug` for internal links.
        { label: 'composables' , slug: 'reusability/composables' },
        { label: 'custom directives' , slug: 'reusability/custom-directives' },
		{ label: 'plugins', slug: 'reusability/plugins' }],
				},
				{
					label: 'scaling up',
					items: [
        // Using `slug` for internal links.
        { label: 'server side rendering', slug: 'scaling-up/server-side-rendering' },
        { label: 'state management', slug: 'scaling-up/state-management' },
		{ label: 'testing' , slug: 'scaling-up/testing' }],
				},
			],
		}),
	],
});

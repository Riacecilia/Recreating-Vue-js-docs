// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Vue.js',
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
					label: 'Getting started',
					 items: [
        // Using `slug` for internal links.
        { label: 'Introduction' , slug: 'getting-started/introduction' },
        { label: 'Quick start' , slug: 'getting-started/quick-start' }],
				},
				{
					label: 'Essentials',
					items: [
        // Using `slug` for internal links.
        { label: 'Class and Style Bindings', slug: 'essentials/class-and-style-bindings' },
        { label: 'Form Input Bindings' , slug: 'essentials/form-input-bindings' },
		{ label: 'Template Syntax' , slug: 'essentials/template-syntax' }],
				},
				{
					label: 'Reusability',
					items: [
        // Using `slug` for internal links.
        { label: 'Composables' , slug: 'reusability/composables' },
        { label: 'Custom Directives' , slug: 'reusability/custom-directives' },
		{ label: 'Plugins', slug: 'reusability/plugins' }],
				},
				{
					label: 'Scaling up',
					items: [
        // Using `slug` for internal links.
        { label: 'Server Side Rendering', slug: 'scaling-up/server-side-rendering' },
        { label: 'State Management', slug: 'scaling-up/state-management' },
		{ label: 'Testing' , slug: 'scaling-up/testing' }],
				},
			],
		}),
	],
});

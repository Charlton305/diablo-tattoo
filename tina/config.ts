import { defineConfig } from 'tinacms'
import GalleryImagePicker from './fields/GalleryImagePicker'
import { ImageUpload } from './fields/ImageUpload'
import { GalleryManager } from './fields/GalleryManager'

export default defineConfig({
  branch: '',
  clientId: '',
  token: '',
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  }, cmsCallback: (cms) => {
    console.log('🔥 cmsCallback fired')

    const STYLE_ID = 'diablo-hide-media'

    const ensureStyle = () => {
      console.log('🔥 ensureStyle called')
      if (document.getElementById(STYLE_ID)) return
      const style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = `
        a[href="#/screens/media_manager"] {
          display: none !important;
        }
        button[value="Media Manager"] {
          display: none !important;
        }
        h4:has(+ ul > li > a[href="#/screens/media_manager"]) {
          display: none !important;
        }
        h4:has(+ ul > li > button[value="Media Manager"]) {
          display: none !important;
        }
        h4:has(+ button[value="Media Manager"]) {
          display: none !important;
        }
      `
      document.head.appendChild(style)
    }

    ensureStyle()
    new MutationObserver(ensureStyle).observe(document.head, { childList: true })

    return cms
  },
  schema: {
    collections: [
      {
        name: 'homepage',
        label: 'Homepage',
        path: 'content',
        format: 'json',
        match: { include: 'homepage' },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => '/',
        },
        fields: [
          {
            type: 'object',
            name: 'hero',
            label: 'Hero',
            fields: [
              { type: 'string', name: 'subtitle', label: 'Subtitle' },
              { type: 'string', name: 'location', label: 'Location' },
            ],
          },
          {
            type: 'object',
            name: 'about',
            label: 'About',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              {
                type: 'string',
                name: 'text',
                label: 'Text',
                ui: { component: 'textarea' },
              },
              { type: 'string', name: 'image', label: 'Image URL' },
              { type: 'string', name: 'imageAlt', label: 'Image Alt Text' },
            ],
          },
          {
            type: 'object',
            name: 'artists',
            label: 'Artists Section',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
            ],
          },
          {
            type: 'object',
            name: 'galleryPreview',
            label: 'Gallery Preview',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              ...Array.from({ length: 6 }, (_, i) => ({
                type: 'string' as const,
                name: `image${i + 1}` as const,
                label: `Image ${i + 1}`,
                ui: { component: GalleryImagePicker as any },
              })),
            ],
          },
        ],
      },
      {
        name: 'artists',
        label: 'Artists',
        path: 'content',
        format: 'json',
        match: { include: 'artists' },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => '/artists',
        },
        fields: [
          { type: 'string', name: 'heading', label: 'Heading' },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: { component: 'textarea' },
          },
          {
            type: 'object',
            name: 'artists',
            label: 'Artists',
            list: true,
            ui: {
              itemProps: (item: Record<string, string>) => ({
                label: item?.name || 'New Artist',
              }),
            },
            fields: [
              { type: 'string', name: 'name', label: 'Name', required: true },
              { type: 'string', name: 'slug', label: 'Slug', required: true },
              { type: 'image', name: 'image', label: 'Profile Image' },
              { type: 'string', name: 'imageAlt', label: 'Image Alt Text' },
              {
                type: 'string',
                name: 'bio',
                label: 'Bio',
                ui: { component: 'textarea' },
              },
              { type: 'boolean', name: 'isArtist', label: 'Is Artist' },
              {
                type: 'object',
                name: 'galleryImages',
                label: 'Gallery Images',
                list: true,
                ui: {
                  component: GalleryManager,
                },
                fields: [
                  { type: 'string', name: 'src' },
                  { type: 'string', name: 'alt' },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'guide',
        label: 'Tattoo Guide',
        path: 'content',
        format: 'json',
        match: { include: 'guide' },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => '/guide',
        },
        fields: [
          { type: 'string', name: 'heading', label: 'Heading' },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: { component: 'textarea' },
          },
          {
            type: 'object',
            name: 'beforeSession',
            label: 'Before Your Session',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              {
                type: 'string',
                name: 'intro',
                label: 'Introduction',
                ui: { component: 'textarea' },
              },
              {
                type: 'object',
                name: 'items',
                label: 'Items',
                list: true,
                ui: {
                  itemProps: (item: Record<string, string>) => ({
                    label: item?.title || 'New Item',
                  }),
                },
                fields: [
                  { type: 'string', name: 'title', label: 'Title' },
                  {
                    type: 'string',
                    name: 'content',
                    label: 'Content',
                    ui: { component: 'textarea' },
                  },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'aftercare',
            label: 'Aftercare',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              {
                type: 'string',
                name: 'intro',
                label: 'Introduction',
                ui: { component: 'textarea' },
              },
              {
                type: 'object',
                name: 'instructions',
                label: 'Instructions',
                list: true,
                fields: [
                  {
                    type: 'string',
                    name: 'content',
                    label: 'Content',
                    ui: { component: 'textarea' },
                  },
                ],
              },
              {
                type: 'string',
                name: 'donts',
                label: 'Do Nots',
                list: true,
              },
              {
                type: 'string',
                name: 'dos',
                label: 'Dos',
                list: true,
              },
              {
                type: 'string',
                name: 'footer',
                label: 'Footer Note',
                ui: { component: 'textarea' },
              },
            ],
          },
        ],
      },
      {
        name: 'gallery',
        label: 'Gallery',
        path: 'content',
        format: 'json',
        match: { include: 'gallery' },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => '/gallery',
        },
        fields: [
          { type: 'string', name: 'heading', label: 'Heading' },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: { component: 'textarea' },
          },
        ],
      },
      {
        name: 'faq',
        label: 'FAQ',
        path: 'content',
        format: 'json',
        match: { include: 'faq' },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => '/faq',
        },
        fields: [
          { type: 'string', name: 'heading', label: 'Heading' },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: { component: 'textarea' },
          },
          {
            type: 'object',
            name: 'items',
            label: 'FAQ Items',
            list: true,
            ui: {
              itemProps: (item: Record<string, string>) => ({
                label: item?.question || 'New Question',
              }),
            },
            fields: [
              { type: 'string', name: 'question', label: 'Question' },
              {
                type: 'string',
                name: 'answer',
                label: 'Answer',
                ui: { component: 'textarea' },
              },
            ],
          },
        ],
      },
      {
        name: 'contact',
        label: 'Contact',
        path: 'content',
        format: 'json',
        match: { include: 'contact' },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => '/contact',
        },
        fields: [
          { type: 'string', name: 'heading', label: 'Heading' },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'formDescription',
            label: 'Form Description',
            ui: { component: 'textarea' },
          },
        ],
      },
      {
        name: 'contactSection',
        label: 'Contact Section',
        path: 'content',
        format: 'json',
        match: {
          include: 'contact-section',
        },
        fields: [
          {
            type: 'string',
            name: 'heading',
            label: 'Heading',
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: {
              component: 'textarea',
            },
          },
        ],
      },
      {
        name: 'site',
        label: 'Site Settings',
        path: 'content',
        format: 'json',
        match: { include: 'site' },
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          { type: 'string', name: 'email', label: 'Email' },
          { type: 'string', name: 'phone', label: 'Phone' },
          { type: 'string', name: 'address', label: 'Address' },
          {
            type: 'object',
            name: 'socialLinks',
            label: 'Social Links',
            fields: [
              { type: 'string', name: 'instagram', label: 'Instagram URL' },
              { type: 'string', name: 'facebook', label: 'Facebook URL' },
            ],
          },
          {
            type: 'object',
            name: 'openingHours',
            label: 'Opening Hours',
            fields: [
              { type: 'string', name: 'monday', label: 'Monday' },
              { type: 'string', name: 'tuesday', label: 'Tuesday' },
              { type: 'string', name: 'wednesday', label: 'Wednesday' },
              { type: 'string', name: 'thursday', label: 'Thursday' },
              { type: 'string', name: 'friday', label: 'Friday' },
              { type: 'string', name: 'saturday', label: 'Saturday' },
              { type: 'string', name: 'sunday', label: 'Sunday' },
            ],
          },
        ],
      },
    ],
  },
})

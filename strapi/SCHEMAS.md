# Strapi схемы (предложение)

## Collection Types

### product
- name (string, required, unique per locale)
- slug (uid, required)
- shortDescription (text)
- description (rich text)
- category (enum: weight, packaged, syrup, must)
- priceFrom (decimal)
- unit (string)
- image (media, single)
- tags (components/tag, repeatable)

### document
- title (string)
- file (media)
- kind (enum: certificate, tu, protocol)

### store
- title (string)
- lat (decimal)
- lng (decimal)
- address (string)

### recipe
- title (string)
- slug (uid)
- time (string)
- steps (component: step, repeatable)
- cover (media)

## Components
### tag
- label (string)

### step
- text (string)

## Права API
- /api/products?populate=image
- /api/recipes?populate=cover
- /api/documents?populate=file
- /api/stores

## Локализация
Включить i18n плагин (ru, en).



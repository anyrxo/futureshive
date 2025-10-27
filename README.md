# Funnel - Modern Landing Page

A beautiful, responsive landing page built with HTML and CSS. Perfect for showcasing products, services, or portfolios.

## Features

- Clean, modern design
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Easy to customize
- Ready to deploy on Vercel

## Local Development

Simply open `index.html` in your browser to view the landing page locally.

## Deployment Instructions

### Deploy to Vercel

1. **Install Vercel CLI** (if you haven't already):
   ```bash
   npm i -g vercel
   ```

2. **Push to GitHub first**:
   ```bash
   git add .
   git commit -m "Initial commit: Landing page"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

3. **Deploy to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration
   - Click "Deploy"

   OR use the CLI:
   ```bash
   vercel
   ```

### Quick Deploy with Vercel CLI

If you want to deploy directly without GitHub:
```bash
vercel --prod
```

## Customization

- **Colors**: Edit CSS variables in `styles.css` (`:root` section)
- **Content**: Modify text in `index.html`
- **Sections**: Add or remove sections as needed
- **Images**: Add your own images and update references

## Project Structure

```
Funnel/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── vercel.json         # Vercel configuration
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## Technologies Used

- HTML5
- CSS3
- Vercel (for deployment)

## License

Free to use for personal and commercial projects.


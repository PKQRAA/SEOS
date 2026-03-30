# SEOS - Open Source Keyword Research Platform

A free and open source keyword research tool for SEO professionals, content creators, and digital marketers.

![SEOS Screenshot](https://via.placeholder.com/800x400?text=SEOS+Keyword+Research+Platform)

## Features

- **Keyword Suggestions** - Generate hundreds of related keyword ideas from a seed keyword
- **Search Volume Estimates** - View estimated monthly search volumes
- **Keyword Difficulty** - Understand how hard it is to rank for each keyword
- **CPC Data** - Get estimated cost-per-click values for paid advertising
- **Competition Analysis** - Categorize keywords by competition level (low/medium/high)
- **Trend Visualization** - See 12-month trend patterns for each keyword
- **Keyword Clustering** - Group keywords by word count and relevance
- **Export Options** - Download keywords as CSV or JSON for further analysis
- **Filtering** - Filter results by search volume, difficulty, and CPC thresholds

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/PKQRAA/SEOS.git
cd SEOS

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
SEOS/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── keywords/
│   │   │       └── route.ts    # API endpoint
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx            # Main page
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx
│   │   ├── KeywordTable.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── StatsPanel.tsx
│   │   └── ExportButton.tsx
│   ├── lib/
│   │   └── keywords.ts          # Keyword generation logic
│   └── types/
│       └── keyword.ts           # TypeScript interfaces
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── README.md
```

## API

### GET /api/keywords

Query the keyword research API.

**Parameters:**
- `seed` (required) - The seed keyword to generate suggestions for
- `minVolume` (optional) - Minimum search volume filter
- `maxDifficulty` (optional) - Maximum difficulty filter
- `minCpc` (optional) - Minimum CPC filter

**Response:**
```json
{
  "keywords": [
    {
      "keyword": "string",
      "searchVolume": 10000,
      "difficulty": 45,
      "cpc": 1.25,
      "competition": "medium",
      "trend": [45, 52, 48, 55, 60, 58, 62, 65, 70, 68, 72, 75],
      "related": ["related keyword 1", "related keyword 2"]
    }
  ],
  "totalCount": 25,
  "clusters": [
    {
      "id": "main",
      "name": "Core Keywords",
      "keywords": ["keyword1", "keyword2"],
      "avgDifficulty": 42,
      "totalSearchVolume": 25000
    }
  ]
}
```

## Data Disclaimer

This tool uses simulated/estimated data for demonstration purposes. The search volumes, difficulty scores, and CPC values are algorithmically generated and do not reflect real Google Keyword Planner data. For production use, consider integrating with actual SEO APIs like:

- Google Keyword Planner
- Ahrefs API
- SEMrush API
- Moz Keyword Explorer

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

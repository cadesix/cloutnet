# CloutNet - Instagram Network Analysis Tool

Discover influential accounts by analyzing who multiple "seed" accounts follow. Minimize API costs by only scraping metadata for users followed by 2+ seeds.

## Core Concept

CloutNet identifies influential accounts in Instagram networks by:
1. Taking 1-10 "seed" accounts as input
2. Scraping their following lists
3. Finding accounts followed by multiple seeds
4. Computing "anchor" accounts (followed by ~40% of seeds)
5. Visualizing results in a lightweight graph with rich metadata

## Cost Optimization

The key innovation is **only scraping profile metadata for users with seedWeight ≥ 2**, reducing API costs by 80-95%. This means you avoid scraping thousands of profiles that are only followed by a single seed account.

## Prerequisites

- Node.js 18+ installed
- An Apify account with API access
- Instagram accounts to analyze (public profiles work best)

## Getting Your Apify API Token

1. Go to [Apify Console](https://console.apify.com/)
2. Sign up or log in
3. Navigate to Settings → Integrations
4. Copy your API token
5. Keep this secure - it will be used to authenticate API requests

## Installation

1. Clone or download this repository:
```bash
cd cloutnet
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your Apify API token:
```
APIFY_API_TOKEN=your_actual_token_here
```

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Open your browser to [http://localhost:3000](http://localhost:3000)

3. Follow the step-by-step flow:

### Step 1: Input Seeds
- Enter 1-10 Instagram usernames (without the @ symbol)
- Separate usernames with newlines or commas
- Example: `elonmusk`, `sama`, `pmarca`

### Step 2: Review Estimation
- The app will show how many total accounts will be scraped
- Review the following count for each seed
- Remember: after filtering (weight ≥ 2), this will be reduced by 80-95%

### Step 3: Confirm & Start
- Click "Confirm & Start" to begin the analysis
- This will use Apify credits to scrape Instagram data
- The process takes several minutes depending on network size

### Step 4: View Results
- Results are displayed in three zones:
  - **Anchors**: Followed by ~40%+ of seeds (most influential)
  - **High Weight**: Followed by 2+ seeds but less than anchor threshold
  - **Long Tail**: Other users with weight ≥ 2

### Step 5: Filter Results
- Use filters to refine the view:
  - Username contains keyword
  - Bio contains keyword
  - Max follower count
- Filters only hide nodes visually - anchor calculations remain unchanged

### Step 6: Explore Users
- Hover over any user node to see rich metadata:
  - Seed weight (# of seeds following)
  - Anchor status
  - # of anchors following this user
  - Follower count
  - Bio
  - Which seeds follow them

## How It Works

### Data Flow

```
1. Input Seeds
   ↓
2. Estimate (lightweight profile scrape)
   ↓
3. Scrape Following Lists (for all seeds)
   ↓
4. Transform & Filter (keep only seedWeight ≥ 2)  ← 80-95% reduction
   ↓
5. Scrape Profiles (only filtered users)
   ↓
6. Compute Anchors
   ↓
7. Visualize
```

### Key Algorithms

**Seed Weight Calculation:**
```typescript
seedWeight = count of seeds following this user
```

**Anchor Threshold:**
```typescript
anchorThreshold = max(3, ceil(seedCount × 0.4))
```

**Anchor Detection:**
```typescript
isAnchor = (seedWeight ≥ anchorThreshold)
```

### Cost Optimization Explained

Traditional approach:
- Seed 1 follows 1000 users
- Seed 2 follows 1000 users
- Seed 3 follows 1000 users
- Total: 3000 profiles to scrape

CloutNet approach:
- Collect all following relationships (3000 edges)
- Compute seed weights
- Filter: keep only users with weight ≥ 2
- Result: ~150-300 profiles to scrape (90%+ reduction)

## Data Persistence

Analyses are automatically saved to browser localStorage and expire after 7 days. You can revisit previous analyses without re-scraping.

## Troubleshooting

### "APIFY_API_TOKEN environment variable is not set"
- Ensure you created `.env.local` (not `.env`)
- Verify the token is copied correctly with no extra spaces
- Restart the dev server after adding the token

### "Failed to scrape following lists"
- Check that the Instagram usernames are valid and public
- Verify your Apify account has sufficient credits
- Instagram may rate limit frequent requests - wait a few minutes and retry

### "No users found with seed weight ≥ 2"
- The seed accounts may have very little overlap in who they follow
- Try choosing seeds that are more likely to follow similar accounts
- Consider using seeds within the same niche or industry

### Actor run timeouts
- Large networks (>1000 following per seed) may take longer
- The default timeout is 5 minutes per actor run
- Consider using fewer seeds or seeds with smaller networks

### Profile images not loading
- Some Instagram CDN URLs may have CORS restrictions
- This doesn't affect functionality, just the visual display
- User initials are shown as fallback

## Project Structure

```
cloutnet/
├── app/
│   ├── actions.ts          # Server actions (Apify API calls)
│   ├── globals.css         # Tailwind styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page (state machine)
├── components/
│   ├── SeedInput.tsx       # Input form
│   ├── EstimationPreview.tsx  # Show estimates
│   ├── ConfirmationGate.tsx   # Confirmation step
│   ├── ProgressTracker.tsx    # Progress display
│   ├── NetworkGraph.tsx    # Graph visualization
│   ├── UserNode.tsx        # Individual user node
│   ├── UserTooltip.tsx     # Metadata tooltip
│   └── FilterControls.tsx  # Filter UI
├── lib/
│   ├── apify.ts           # Apify API client
│   ├── calculations.ts    # Weight & anchor logic
│   ├── graph.ts           # Clustering & filtering
│   ├── storage.ts         # localStorage utilities
│   └── types.ts           # TypeScript types
└── .env.local             # Your API token (create this)
```

## Technical Details

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API:** Apify Instagram Profile Scraper
- **State Management:** React useState
- **Persistence:** Browser localStorage

## Limitations

- Depth limit = 1 (seeds → following only, no recursion)
- Maximum 10 seed accounts per analysis
- Minimum seed weight = 2 (hardcoded, not adjustable)
- Private Instagram accounts cannot be scraped
- Rate limits apply based on your Apify plan

## Future Enhancements

- Export results to CSV/JSON
- Compare multiple analyses side-by-side
- Scrape anchor followings (depth = 1 recursion)
- Advanced filters (engagement rate, post frequency)
- Network graph with edges (toggle view)
- Historical analysis tracking

## License

MIT

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Verify your Apify account status and credits
3. Review the browser console for error messages
4. Check that Instagram usernames are valid and public

## Contributing

Contributions welcome! Please ensure:
- TypeScript types are properly defined
- Components follow existing patterns
- Cost optimization strategies are preserved
- Documentation is updated

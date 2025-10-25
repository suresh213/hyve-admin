# Aadarsh Pariksha Kendra – Exam Center Panel

A React TypeScript admin panel for managing exam centers, tasks, jobs, and users.

## Campaign Analytics API Integration

The frontend has been updated to integrate with the new simplified Campaign Analytics API. Here's how to use it:

### API Service Functions

```typescript
import {
  getCampaignStats,
  getCampaignDailyStats,
  getCampaignLeads,
  getLeadTimeline,
} from '@/service/campaignApi'

// Get overall campaign stats with optional date range
const stats = await getCampaignStats(
  campaignId,
  '2024-01-01', // optional startDate
  '2024-01-31' // optional endDate
)

// Get daily stats for charts
const dailyStats = await getCampaignDailyStats(
  campaignId,
  '2024-01-01', // optional startDate
  '2024-01-31' // optional endDate
)

// Get campaign leads
const leads = await getCampaignLeads(campaignId)

// Get lead timeline
const timeline = await getLeadTimeline(campaignId, leadId)
```

### Data Structures

#### Overall Stats Response

```typescript
interface CampaignOverallStats {
  campaign: {
    id: string
    name: string
    status: string
    createdAt: string
  }
  dateRange: {
    startDate: string
    endDate: string
  }
  metrics: {
    totalLeads: number
    profileVisits: number
    connectionsRequested: number
    connectionsAccepted: number
    dmsSent: number
  }
  successRates: {
    connectionAcceptance: number
    dmDelivery: number
    overallCompletion: number
  }
}
```

#### Daily Stats Response

```typescript
interface CampaignDailyStats {
  date: string
  profileVisits: number
  connectionsRequested: number
  connectionsAccepted: number
  dmsSent: number
  successRates: {
    connectionAcceptance: number
    dmDelivery: number
  }
}
```

### Component Usage

#### CampaignAnalyticsWrapper

```typescript
import { CampaignAnalyticsWrapper } from '@/pages/campaign/components/CampaignAnalyticsWrapper'

// Basic usage - automatically uses campaign createdAt to current date
<CampaignAnalyticsWrapper campaignId="campaign-id" />

// With custom date range
<CampaignAnalyticsWrapper
  campaignId="campaign-id"
  startDate="2024-01-01"
  endDate="2024-01-31"
  showChart={true}
  showProgress={true}
/>
```

#### Date Range Picker

The date range picker is now fully functional and automatically defaults to the campaign's lifecycle:

```typescript
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker'
import { DateRange } from 'react-day-picker'
import { useState } from 'react'

function MyComponent() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  return (
    <CalendarDateRangePicker
      date={dateRange}
      onDateChange={setDateRange}
      className="w-[240px]"
    />
  )
}
```

**Default Date Range Behavior:**

- **Start Date**: Campaign's `createdAt` date
- **End Date**: Current date
- **Fallback**: If no `createdAt` available, defaults to January 1, 2024

#### OutreachAnalytics Page

The OutreachAnalytics page (`/analytics`) provides a full analytics dashboard with:

- Campaign selection dropdown
- **Smart date range picker** that auto-sets to campaign lifecycle 🎉
- Comprehensive metrics display
- Interactive charts
- Real-time data filtering

### Key Features

✅ **Intelligent Date Defaults**: Automatically sets date range from campaign creation to today  
✅ **Working Date Picker**: Fully functional date range picker with real-time updates  
✅ **Campaign Lifecycle Aware**: Respects each campaign's actual timeline  
✅ **Lead-Centric Metrics**: All metrics count unique leads, not actions  
✅ **Success Rate Calculations**: Built-in success rate calculations  
✅ **Chart Integration**: Ready for Chart.js or Recharts integration  
✅ **TypeScript Support**: Full type definitions included  
✅ **Real-time Filtering**: Date changes automatically trigger new API calls

### How the Date Range Picker Works

1. **Campaign Selection**: When a campaign is selected, the system fetches campaign details
2. **Smart Defaults**: Date range is automatically set from campaign's `createdAt` to current date
3. **User Override**: Users can manually select any date range they want
4. **Real-time Updates**: API calls are triggered automatically when dates change
5. **Visual Feedback**: Charts and metrics update instantly

### Smart Date Range Logic

```typescript
// When campaign is selected
const campaign = await getCampaignById(campaignId)
const defaultRange = {
  from: new Date(campaign.createdAt), // Campaign creation date
  to: new Date(), // Current date
}
```

### Error Handling

All API functions include proper error handling:

```typescript
try {
  const stats = await getCampaignStats(campaignId)
  // Handle success
} catch (error) {
  console.error('Failed to fetch campaign stats:', error)
  // Handle error
}
```

### API Endpoints Used

- `GET /api/campaigns/:campaignId/stats` - Overall campaign statistics
- `GET /api/campaigns/:campaignId/daily-stats` - Daily statistics
- `GET /api/campaigns/:campaignId/leads` - Campaign leads
- `GET /api/campaigns/:campaignId/leads/:leadId/timeline` - Lead timeline
- `GET /api/campaigns/:campaignId` - Campaign details (for date defaults)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

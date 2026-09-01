import { Card, CardContent } from '@/components/ui/card'

export const Dashboard = () => (
  <div className="flex flex-col p-4 md:p-0 md:flex-row items-center w-full gap-6">
    <Card className="w-full md:max-w-3xs" size="sm">
      <CardContent>
        <p className="text-primary text-center text-3xl md:text-6xl">3</p>
        <p className="text-center">Place on the leaderboard</p>
      </CardContent>
    </Card>
    <Card className="w-full md:max-w-3xs" size="sm">
      <CardContent>
        <p className="text-primary text-center text-3xl md:text-6xl">1229</p>
        <p className="text-center">Total points</p>
      </CardContent>
    </Card>
    <Card className="w-full md:max-w-3xs" size="sm">
      <CardContent>
        <p className="text-primary text-center text-3xl md:text-6xl">14</p>
        <p className="text-center">Songs played</p>
      </CardContent>
    </Card>
  </div>
)

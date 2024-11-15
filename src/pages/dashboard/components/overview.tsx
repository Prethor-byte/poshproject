import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { date: '2024-03-15', shares: 145, follows: 23 },
  { date: '2024-03-16', shares: 168, follows: 25 },
  { date: '2024-03-17', shares: 156, follows: 31 },
  { date: '2024-03-18', shares: 182, follows: 28 },
  { date: '2024-03-19', shares: 193, follows: 35 },
  { date: '2024-03-20', shares: 173, follows: 32 },
  { date: '2024-03-21', shares: 188, follows: 29 },
];

export function Overview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="shares"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="follows"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
import { Users, Calendar, Activity, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

function StatsOverviewCards() {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300,1fr))] gap-4">
            <Card className="flex flex-row items-center gap-2 px-6 py-8">
                <div className="flex-1">
                    <CardHeader className="p-0">Total Spelare</CardHeader>
                    <CardTitle>8</CardTitle>
                    <CardDescription>aktiva spelare</CardDescription>
                </div>
                <Users />
            </Card>
            <Card className="flex flex-row items-center gap-2 px-6 py-8">
                <div className="flex-1">
                    <CardHeader className="p-0">Attendance</CardHeader>
                    <CardTitle>87.5%</CardTitle>
                    <CardDescription>Genomsnittlig närvaro</CardDescription>
                </div>
                <Calendar />
            </Card>
            <Card className="flex flex-row items-center gap-2 px-6 py-8">
                <div className="flex-1">
                    <CardHeader className="p-0">AVG PTC</CardHeader>
                    <CardTitle>67.5</CardTitle>
                    <CardDescription>teknisk kompetens</CardDescription>
                </div>
                <TrendingUp />
            </Card>
            <Card className="flex flex-row items-center gap-2 px-6 py-8">
                <div className="flex-1">
                    <CardHeader className="p-0">Total AVG PAH</CardHeader>
                    <CardTitle>88.1</CardTitle>
                    <CardDescription>biologisk mognad</CardDescription>
                </div>
                <Activity />
            </Card>
        </div>
    );
}

export default StatsOverviewCards;

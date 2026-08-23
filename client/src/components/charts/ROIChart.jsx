import { currency } from '../../utils/formatter';
import { COLORS } from '../../utils/chartColors';
import CustomTooltip from './ChartTooltip';
import {
    ResponsiveContainer,
    AreaChart,
    // linearGradient,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceLine,
    Area,
} from 'recharts';

export default function ROIChart({ data, installCost }) {
    return (
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.yearlyProjection} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="roiFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={COLORS.leaf} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={COLORS.leaf} stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke={COLORS.ink}
                    label={{ value: 'Year', position: 'insideBottom', offset: -2, fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} stroke={COLORS.ink} tickFormatter={currency} width={70} />
                    <Tooltip content={<CustomTooltip formatter={currency} />} />
                    <ReferenceLine x={data.paybackYears} stroke={COLORS.rust} strokeDasharray="4 4"
                    label={{ value: `Payback: ${data.paybackYears}yr`, fontSize: 11, fill: COLORS.rust, position: 'top' }} />
                    <ReferenceLine y={0} stroke={COLORS.ink} strokeOpacity={0.4} />
                    <ReferenceLine y={installCost} stroke={COLORS.rust} strokeDasharray="2 2"
                        label={{ value: 'Install Cost', fontSize: 11, position: 'right' }} />
                    <Area type="monotone" dataKey="cumulativeSavings" name="Cumulative Savings"
                    stroke={COLORS.leaf} fill="url(#roiFill)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
    );
}
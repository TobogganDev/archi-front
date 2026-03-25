import { useAuthContext } from "@/app/providers";
import type { Program } from "@/entities/program";
import { usePrograms } from "@/entities/program";
import type { StampWithRelations } from "@/entities/stamp";
import { useStampsByMerchant } from "@/entities/stamp";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
    type ChartOptions,
} from "chart.js";
import { useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Link } from "react-router-dom";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend,
    Filler,
);

type PeriodFilter = "all" | 90 | 30 | 7;

const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
    { value: "all", label: "Depuis toujours" },
    { value: 90, label: "90 jours" },
    { value: 30, label: "30 jours" },
    { value: 7, label: "7 jours" },
];

const CHART_COLORS = {
    orange: "#FF3B00",
    orangeSoft: "#ff3b0033",
    brown: "#1A1008",
    brownSoft: "#1a100826",
};

const CHART_COLORS_LIST = [
    { background: "#ff3b0059", border: "#FF3B00" },
    { background: "#e5d9c0f2", border: "#E03500" },
    { background: "#2d1c1238", border: "#2D1C12" },
    { background: "#f0e6d1f2", border: "#1A1008" },
];

const EMPTY_LINE_CHART = {
    labels: [] as string[],
    datasets: [
        {
            label: "Tampons valides",
            data: [] as number[],
            borderColor: CHART_COLORS.orange,
            backgroundColor: CHART_COLORS.orangeSoft,
            fill: true,
            tension: 0.25,
            pointRadius: 2,
            pointHoverRadius: 5,
        },
    ],
};

type StampMeta = StampWithRelations & {
    createdAtMs: number;
    dayKey: string;
};

type ProgramChart = {
    programId: string;
    programName: string;
    hasData: boolean;
    chartData: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string[];
            borderColor: string[];
            borderWidth: number;
        }[];
    };
};

function buildBucketColor(index: number): { background: string; border: string } {
    const color = CHART_COLORS_LIST[(index - 1) % CHART_COLORS_LIST.length];
    return {
        background: color.background,
        border: color.border,
    };
}

function formatAxisDate(key: string): string {
    const [yearText, monthText, dayText] = key.split("-");
    const year = Number(yearText);
    const month = Number(monthText) - 1;
    const day = Number(dayText);
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
    }).format(new Date(year, month, day));
}

function toPeriodStart(period: PeriodFilter): number | null {
    if (period === "all") {
        return null;
    }

    const nowMs = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    return nowMs - period * dayMs;
}

function dateToKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function startOfDay(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
}

function withStampMeta(stamps: StampWithRelations[]): StampMeta[] {
    return stamps.map((stamp) => {
        const parsedDate = new Date(stamp.created_at);
        return {
            ...stamp,
            createdAtMs: parsedDate.getTime(),
            dayKey: dateToKey(parsedDate),
        };
    });
}

function buildLineChartData(filteredStamps: StampMeta[], period: PeriodFilter) {
    if (filteredStamps.length === 0) {
        return EMPTY_LINE_CHART;
    }

    const countByDay = new Map<string, number>();
    for (const stamp of filteredStamps) {
        countByDay.set(stamp.dayKey, (countByDay.get(stamp.dayKey) ?? 0) + 1);
    }

    const firstStampMs = filteredStamps.reduce(
        (min, stamp) => Math.min(min, stamp.createdAtMs),
        Number.POSITIVE_INFINITY,
    );
    const periodStartMs = toPeriodStart(period);
    const startDate = startOfDay(new Date(period === "all" ? firstStampMs : (periodStartMs ?? firstStampMs)));
    const endDate = startOfDay(new Date());

    const labels: string[] = [];
    const data: number[] = [];
    const cursor = new Date(startDate);

    while (cursor.getTime() <= endDate.getTime()) {
        const key = dateToKey(cursor);
        labels.push(formatAxisDate(key));
        data.push(countByDay.get(key) ?? 0);
        cursor.setDate(cursor.getDate() + 1);
    }

    return {
        labels,
        datasets: [
            {
                label: "Tampons valides",
                data,
                borderColor: CHART_COLORS.orange,
                backgroundColor: CHART_COLORS.orangeSoft,
                fill: true,
                tension: 0.25,
                pointRadius: 2,
                pointHoverRadius: 5,
            },
        ],
    };
}

function getCustomerStampCountByProgram(filteredStamps: StampMeta[]): Map<string, Map<string, number>> {
    const programCustomerCountMap = new Map<string, Map<string, number>>();

    for (const stamp of filteredStamps) {
        const customerMap = programCustomerCountMap.get(stamp.program_id) ?? new Map<string, number>();
        customerMap.set(stamp.customer_id, (customerMap.get(stamp.customer_id) ?? 0) + 1);
        programCustomerCountMap.set(stamp.program_id, customerMap);
    }

    return programCustomerCountMap;
}

function buildProgramChart(program: Program, counts: number[]): ProgramChart {
    const maxStampCount = counts.length > 0 ? Math.max(...counts) : 0;
    const bucketCount = Math.max(program.stamps_required, maxStampCount);
    const buckets = Array.from({ length: bucketCount }, (_, index) => index + 1);

    const labels = buckets.map((bucket) => (bucket === 1 ? "1 tampon" : `${bucket} tampons`));
    const data = buckets.map((bucket) => {
        let total = 0;
        for (const count of counts) {
            if (count === bucket) {
                total += 1;
            }
        }
        return total;
    });

    return {
        programId: program.id,
        programName: program.name,
        hasData: bucketCount > 0,
        chartData: {
            labels,
            datasets: [
                {
                    label: "Nombre de clients",
                    data,
                    backgroundColor: data.map((_, index) => buildBucketColor(index + 1).background),
                    borderColor: data.map((_, index) => buildBucketColor(index + 1).border),
                    borderWidth: 1,
                },
            ],
        },
    };
}

export function ProgressionPage() {
    const { user } = useAuthContext();
    const merchantId = user?.id;
    const [period, setPeriod] = useState<PeriodFilter>("all");

    const {
        data: programs = [],
        isLoading: isProgramsLoading,
        error: programsError,
    } = usePrograms(merchantId ?? "");
    const {
        data: stamps = [],
        isLoading: isStampsLoading,
        error: stampsError,
    } = useStampsByMerchant(merchantId ?? "");

    const isLoading = isProgramsLoading || isStampsLoading;
    const error = programsError ?? stampsError;

    const stampsWithMeta = useMemo(() => withStampMeta(stamps), [stamps]);
    const periodStartMs = useMemo(() => toPeriodStart(period), [period]);

    const filteredStamps = useMemo(() => {
        if (periodStartMs === null) {
            return stampsWithMeta;
        }

        return stampsWithMeta.filter((stamp) => stamp.createdAtMs >= periodStartMs);
    }, [stampsWithMeta, periodStartMs]);

    const lineChart = useMemo(
        () => buildLineChartData(filteredStamps, period),
        [filteredStamps, period],
    );

    const perProgramCharts = useMemo(() => {
        const programCustomerCountMap = getCustomerStampCountByProgram(filteredStamps);

        return programs.map((program) => {
            const customerMap = programCustomerCountMap.get(program.id) ?? new Map<string, number>();
            const counts = Array.from(customerMap.values());
            return buildProgramChart(program, counts);
        });
    }, [filteredStamps, programs]);

    const lineOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label(context) {
                        const value = Number(context.raw ?? 0);
                        return value > 1 ? `${value} tampons` : `${value} tampon`;
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: { color: CHART_COLORS.brown },
                grid: { display: false },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    color: CHART_COLORS.brown,
                },
            },
        },
    };

    const barOptions: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label(context) {
                        const value = Number(context.raw ?? 0);
                        const suffix = value > 1 ? "clients" : "client";
                        return `${value} ${suffix}`;
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: { color: CHART_COLORS.brown },
                grid: { display: false },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    color: CHART_COLORS.brown,
                },
                title: {
                    display: true,
                    text: "Nombre de clients",
                    color: CHART_COLORS.brown,
                },
                grid: { color: CHART_COLORS.brownSoft },
            },
        },
    };

    if (!merchantId) {
        return <p className="text-brown/70">Utilisateur non connecte.</p>;
    }

    if (isLoading) {
        return <p className="text-brown/70">Chargement des graphiques...</p>;
    }

    if (error) {
        return (
            <p className="text-sm text-red-600">
                Erreur lors du chargement des graphiques: {error.message}
            </p>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-brown">Progression</h1>
                    <p className="text-sm text-brown/70">Suivi des tampons par periode et par programme</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex rounded-lg bg-white p-1 shadow-sm">
                        {PERIOD_OPTIONS.map((option) => (
                            <button
                                key={option.label}
                                type="button"
                                onClick={() => setPeriod(option.value)}
                                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${period === option.value ? "bg-orange text-white" : "text-brown/70 hover:bg-cream"
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center justify-center rounded-md border border-brown/20 bg-white px-4 py-2 text-sm font-medium text-brown transition hover:bg-cream"
                    >
                        Retour au dashboard
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <section className="rounded-lg bg-white p-6 shadow-sm xl:col-span-2">
                    <h2 className="text-lg font-semibold text-brown">Evolution des tampons</h2>
                    <div className="mt-4 h-75">
                        {lineChart.labels.length === 0 ? (
                            <p className="text-sm text-brown/60">Aucune donnee pour cette periode.</p>
                        ) : (
                            <Line data={lineChart} options={lineOptions} />
                        )}
                    </div>
                </section>

                <section className="rounded-lg bg-white p-6 shadow-sm xl:col-span-3">
                    <h2 className="text-lg font-semibold text-brown">Distribution des tampons par programme</h2>
                    <div className="mt-4 gap-4 flex flex-col">
                        {perProgramCharts.length === 0 ? (
                            <p className="text-sm text-brown/60">Aucun programme disponible.</p>
                        ) : (
                            perProgramCharts.map((chart) => (
                                <article key={chart.programId} className="rounded-md border border-brown/10 bg-cream/40 p-4 w-full">
                                    <h3 className="text-sm font-semibold text-brown">{chart.programName}</h3>
                                    <div className="mt-3 h-64">
                                        {chart.hasData ? (
                                            <Bar data={chart.chartData} options={barOptions} />
                                        ) : (
                                            <p className="text-sm text-brown/60">Aucun tampon pour ce programme sur la periode.</p>
                                        )}
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

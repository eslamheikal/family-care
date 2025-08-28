import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { MonthesService } from '../../../../core/services/monthes.service';
import { LineChartProps } from '../../props/line-chart.props';
import { ChartModule } from "primeng/chart";

@Component({
    selector: 'line-chart',
    imports: [ChartModule],
    templateUrl: './line-chart.html',
    styleUrl: './line-chart.scss'
})
export class LineChart {

    // Properties
    chartData: any;
    chartOptions: any;
    @Input() dataSet: LineChartProps[] = [];
    @Input() xLabel: string = '';
    @Input() yLabel: string = '';
    @Input() labels: string[] = [];
    @Input() tooltipLabel: (context: any) => string = () => '';

    // private translateService = inject(TranslateService);
    private monthesService = inject(MonthesService);

    ngOnChanges(changes: SimpleChanges) {
        if (changes['dataSet']) {
            this.initializeChart();
        }
    }

    initializeChart() {

        this.chartData = {
            labels: this.labels.length > 0 ? this.labels : this.monthesService.getMonthes(),
            datasets: this.dataSet
        };

        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: this.tooltipLabel
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: this.xLabel,
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: this.yLabel,
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        };
    }

}

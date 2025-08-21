const app = new Vue({
	el: '#app',
	data: {
		gasoline: {
			price: 200000,
			residualValue: 140000, // 70% of price
			annualMileage: 15000,
			fuelCostPerKm: 0.7,
			highwayMileage: 5000,
			highwayCostPerKm: 0.4,
			maintenanceInterval: 10000,
			maintenanceCost: 1000,
			insuranceCost: 5000,
			parkingCost: 2000,
			years: 5
		},
		electric: {
			price: 250000,
			residualValue: 125000, // 50% of price
			annualMileage: 15000,
			fuelCostPerKm: 0.2,
			highwayMileage: 5000,
			highwayCostPerKm: 0.4,
			maintenanceInterval: 20000,
			maintenanceCost: 500,
			insuranceCost: 5500,
			parkingCost: 2000,
			years: 5
		},
		chart: null
	},
	computed: {
		gasolineDepreciation() {
			return (this.gasoline.price - this.gasoline.residualValue) / this.gasoline.years;
		},
		electricDepreciation() {
			return (this.electric.price - this.electric.residualValue) / this.electric.years;
		},
		gasolineFuelCost() {
			return this.gasoline.annualMileage * this.gasoline.fuelCostPerKm;
		},
		electricFuelCost() {
			return this.electric.annualMileage * this.electric.fuelCostPerKm;
		},
		gasolineHighwayCost() {
			return this.gasoline.highwayMileage * this.gasoline.highwayCostPerKm;
		},
		electricHighwayCost() {
			return this.electric.highwayMileage * this.electric.highwayCostPerKm;
		},
		gasolineMaintenanceCost() {
			return Math.ceil(this.gasoline.annualMileage / this.gasoline.maintenanceInterval) * this.gasoline.maintenanceCost;
		},
		electricMaintenanceCost() {
			return Math.ceil(this.electric.annualMileage / this.electric.maintenanceInterval) * this.electric.maintenanceCost;
		},
		gasolineAverageYearlyCost() {
			return this.gasolineDepreciation + this.gasolineFuelCost + this.gasolineHighwayCost +
				this.gasolineMaintenanceCost + this.gasoline.insuranceCost + this.gasoline.parkingCost;
		},
		electricAverageYearlyCost() {
			return this.electricDepreciation + this.electricFuelCost + this.electricHighwayCost +
				this.electricMaintenanceCost + this.electric.insuranceCost + this.electric.parkingCost;
		},
		gasolineTotalCost() {
			return this.gasolineAverageYearlyCost * this.gasoline.years;
		},
		electricTotalCost() {
			return this.electricAverageYearlyCost * this.electric.years;
		},
		gasolineCostPerKmTotal() {
			const totalMileage = this.gasoline.annualMileage * this.gasoline.years;
			const totalCost = this.gasoline.price + (this.gasolineFuelCost * this.gasoline.years +
				this.gasolineHighwayCost * this.gasoline.years +
				Math.ceil((this.gasoline.annualMileage * this.gasoline.years) / this.gasoline.maintenanceInterval) * this.gasoline.maintenanceCost +
				this.gasoline.insuranceCost * this.gasoline.years + this.gasoline.parkingCost * this.gasoline.years) - this.gasoline.residualValue;
			return totalMileage > 0 ? totalCost / totalMileage : 0;
		},
		electricCostPerKmTotal() {
			const totalMileage = this.electric.annualMileage * this.electric.years;
			const totalCost = this.electric.price + (this.electricFuelCost * this.electric.years +
				this.electricHighwayCost * this.electric.years +
				Math.ceil((this.electric.annualMileage * this.electric.years) / this.electric.maintenanceInterval) * this.electric.maintenanceCost +
				this.electric.insuranceCost * this.electric.years + this.electric.parkingCost * this.electric.years) - this.electric.residualValue;
			return totalMileage > 0 ? totalCost / totalMileage : 0;
		},
		costDifference() {
			return Math.abs(this.gasolineTotalCost - this.electricTotalCost);
		},
		savingsPercentage() {
			const higherCost = Math.max(this.gasolineTotalCost, this.electricTotalCost);
			return (this.costDifference / higherCost) * 100;
		},
		lowerCostVehicle() {
			return this.gasolineTotalCost >= this.electricTotalCost ? '电车更省钱' : '油车更省钱';
		},
		breakevenPoint() {
			const maxYears = 20;
			let breakevenYear = -1;
			for (let i = 1; i <= maxYears; i++) {
				const gasCumulativeCost = this.gasoline.price + (this.gasolineFuelCost * i +
					this.gasolineHighwayCost * i +
					Math.ceil((this.gasoline.annualMileage * i) / this.gasoline.maintenanceInterval) * this.gasoline.maintenanceCost +
					this.gasoline.insuranceCost * i + this.gasoline.parkingCost * i) - this.gasoline.residualValue;
				const elecCumulativeCost = this.electric.price + (this.electricFuelCost * i +
					this.electricHighwayCost * i +
					Math.ceil((this.electric.annualMileage * i) / this.electric.maintenanceInterval) * this.electric.maintenanceCost +
					this.electric.insuranceCost * i + this.electric.parkingCost * i) - this.electric.residualValue;
				const gasMileage = this.gasoline.annualMileage * i;
				const elecMileage = this.electric.annualMileage * i;
				const gasCostPerKm = gasMileage > 0 ? gasCumulativeCost / gasMileage : 0;
				const elecCostPerKm = elecMileage > 0 ? elecCumulativeCost / elecMileage : 0;
				if (elecCostPerKm <= gasCostPerKm && breakevenYear === -1) {
					breakevenYear = i;
				}
			}
			return {
				year: breakevenYear > 0 ? breakevenYear : '未回本'
			};
		},
		yearlyChartData() {
			const maxYears = 20;
			const gasolineCosts = [];
			const electricCosts = [];
			for (let i = 1; i <= maxYears; i++) {
				const gasCumulativeCost = this.gasoline.price + (this.gasolineFuelCost * i +
					this.gasolineHighwayCost * i +
					Math.ceil((this.gasoline.annualMileage * i) / this.gasoline.maintenanceInterval) * this.gasoline.maintenanceCost +
					this.gasoline.insuranceCost * i + this.gasoline.parkingCost * i) - this.gasoline.residualValue;
				const elecCumulativeCost = this.electric.price + (this.electricFuelCost * i +
					this.electricHighwayCost * i +
					Math.ceil((this.electric.annualMileage * i) / this.electric.maintenanceInterval) * this.electric.maintenanceCost +
					this.electric.insuranceCost * i + this.electric.parkingCost * i) - this.electric.residualValue;
				const gasMileage = this.gasoline.annualMileage * i;
				const elecMileage = this.electric.annualMileage * i;
				gasolineCosts.push(gasMileage > 0 ? gasCumulativeCost / gasMileage : 0);
				electricCosts.push(elecMileage > 0 ? elecCumulativeCost / elecMileage : 0);
			}
			return {
				labels: Array.from({ length: maxYears }, (_, i) => `第${i + 1}年`),
				datasets: [
					{
						label: '油车每公里成本',
						data: gasolineCosts,
						borderColor: '#ff4444',
						backgroundColor: 'rgba(255, 68, 68, 0.2)',
						fill: false
					},
					{
						label: '电车每公里成本',
						data: electricCosts,
						borderColor: '#00C4B4',
						backgroundColor: 'rgba(0, 196, 180, 0.2)',
						fill: false
					}
				]
			};
		}
	},
	methods: {
		formatNumber(num, decimals = 0) {
			return Number(num).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		},
		updateChart() {
			const ctx = document.getElementById('costChart').getContext('2d');
			if (this.chart) {
				this.chart.destroy();
			}
			this.chart = new Chart(ctx, {
				type: 'line',
				data: this.yearlyChartData,
				options: {
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						y: {
							beginAtZero: true,
							title: {
								display: true,
								text: '每公里成本 (元)'
							}
						},
						x: {
							title: {
								display: true,
								text: '年份'
							}
						}
					},
					plugins: {
						legend: {
							position: 'top'
						},
						title: {
							display: true,
							text: '年度每公里成本趋势（回本分析）'
						}
					}
				}
			});
		}
	},
	watch: {
		gasoline: {
			handler() {
				this.$nextTick(() => {
					this.updateChart();
				});
			},
			deep: true
		},
		electric: {
			handler() {
				this.$nextTick(() => {
					this.updateChart();
				});
			},
			deep: true
		}
	},
	mounted() {
		this.updateChart();
	}
});

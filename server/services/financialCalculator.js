export async function financialEngine(bestConfig, monthlyBill, monthlyUsage) {
    // code goes here
    let production = bestConfig.annualProduction;

    let annualUsage = monthlyUsage * 12;

    let annualBill = monthlyBill * 12;

    let electricityRate = annualBill / annualUsage;

    let cumulativeSavings = 0;

    let projection = [];

    const maintenance = 150;


    for (let year = 1; year <= 25; year++) {

        let yearlySavings =
            Math.min(production, annualUsage)
            * electricityRate - maintenance;

        cumulativeSavings += yearlySavings;

        const cumulativeProfit = cumulativeSavings - bestConfig.installationCost;

        projection.push({

            year,
        
            production,
        
            electricityRate,
        
            yearlySavings,
        
            cumulativeSavings,
        
            cumulativeProfit
        
        });

        production *= 0.995;

        electricityRate *= 1.035;
    }




    return {

        summary: bestConfig,
    
        yearlyProjection: projection
    
    };


}
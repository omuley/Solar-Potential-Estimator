export async function optimizer(panelConfigs, monthlyBill, monthlyUsage) {
    let bestConfig = null;
    for (const config of panelConfigs) {
        //vars
        let panelsCount = config.panelsCount;

        let annualProduction = config.yearlyEnergyDcKwh;

        let annualUsage = monthlyUsage * 12;

        let annualBill = monthlyBill * 12;

        let electricityRate = annualBill / annualUsage;

        //estimate installation cost using cost-per-watt model is closer to how the industry estimates systems
        let systemSize =  annualProduction / 1400; //A 1 kW solar system in the U.S. typically produces around 1,300–1,500 kWh/year, depending on location

        let instC = systemSize * 1000 * electricityRate;

        
         //estimate annual savings
        let offsetEnergy = Math.min(annualProduction, annualUsage); //homeowner can't save more than they spend
        let savings = offsetEnergy * electricityRate;
    
        //estimate payback

        let payback = instC / savings;
    
        //estimate 25-year ROI

        let cumulativeSavings = 0;

        let production = annualProduction;

        const maintenance = 150;

        let projectedRate = electricityRate;


        for (let year = 1; year <= 25; year++) {

            let yearlySavings =
                Math.min(production, annualUsage)
                * projectedRate - maintenance;

            production *= 0.995; //because panels slowly wear out..

            projectedRate *= 1.035; //electricity gets more expensive,,approximation by 3.4% according to  U.S. Energy Information Administration (EIA).

            cumulativeSavings += yearlySavings;
        }

        let roi = (cumulativeSavings - instC) / instC;

        //check best
        let netProfit = cumulativeSavings - instC;
        console.log("Net Profit per Panel:", netProfit);
        console.log("Panel count:", panelsCount);
        

        if(!bestConfig || netProfit > bestConfig.netProfit) {
            bestConfig = {

                panelCount: panelsCount,
        
                annualProduction: annualProduction,
        
                installationCost: instC,
        
                annualSavings: savings,
        
                payback,
        
                roi,
        
                netProfit
            };
        } 
    }

    if (!bestConfig) {
        throw new Error("No valid solar configurations found.");
    }

    return bestConfig;
  
}
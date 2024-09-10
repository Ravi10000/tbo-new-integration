export function mergeResponsesForDOM(input: any): any {
    const mergedResponse: any = {
        uniqueKey: "",
        traceId: "",
        journey: []
    };

    for (const key in input) {
        const airline = input[key];
        if (!mergedResponse.uniqueKey) {
            mergedResponse.uniqueKey = airline.uniqueKey;
            mergedResponse.traceId = airline.traceId;
        }

        airline.journey.forEach((journey: any) => {
            const existingJourney = mergedResponse.journey.find(
                (j:any) => j.origin === journey.origin && j.destination === journey.destination
            );

            if (existingJourney) {
                existingJourney.itinerary.push(...journey.itinerary);
            } else {
                mergedResponse.journey.push(journey);
            }
        });
    }   

    return mergedResponse;
}

export function mergeResponsesForINT(data: { [key: string]: any }): any {
    const mergedItineraries: any = [];
    let uniqueKey = '';
    let traceId = '';
    let origin = '';
    let destination = '';

    for (const airline in data) {
        if (data.hasOwnProperty(airline)) {
            const airlineData = data[airline];
            uniqueKey = airlineData.uniqueKey;
            traceId = airlineData.traceId;

            for (const journey of airlineData.journey) {
                if (!origin) {
                    origin = journey.origin;
                }
                if (!destination) {
                    destination = journey.destination;
                }
                mergedItineraries.push(...journey.itinerary);
            }
        }
    }

    return {
        uniqueKey,
        traceId,
        journey: [
            {
                uid: uniqueKey,
                origin,
                destination,
                itinerary: mergedItineraries
            }
        ]
    };
}

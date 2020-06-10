exports.askQuestion = (text,showOpportunity) => {
    var card ={
    "cards":[
        {
            "sections": [
                {
                    "widgets": [
                        {
                            "textParagraph": {
                                "text": `${text}`,
                            }
                            
                        }
                    ]
                }
            ]
        }
    ]
    }
    if (showOpportunity) {
        card['cards'].unshift({
            "header": {
                "title": showOpportunity
            },
        })
    }
    return card;
    }
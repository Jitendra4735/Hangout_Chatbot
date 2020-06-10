module.exports.getSuggestionButton = (suggestionButton,text,message) => {
    var card = {
        "cards": [
            {
                "sections": []
            }
        ]
    }
    // var length = suggestionButton.length;
    // if (length % 2 !== 0) {
    //     length = length - 1
    // }
    let i = 0;
        var buttons = [];
        try {
        for (let i = 0; i <suggestionButton.length; i++) {
            var button_text = {
                textButton: {
                    text: `<b> ${suggestionButton[i]} </b>`,
                    onClick: {
                        action: {
                            actionMethodName: suggestionButton[i]
                        }
                    }
                }
            };
            buttons.push(button_text);
        }
        
        
    
        card['cards'][0]['sections'].push({
            "widgets": [
                {
                "textParagraph": {
                    "text": `<b> ${text} </b>`,
                }},
                {
                    "buttons": buttons
                }
            ]

        })  
        if (message) {
            card['cards'].unshift({
                "header": {
                    "title": message
                },
            })
        }
        return card;
    }
    catch (error) {
        console.error(error);
        return errorMessage
    }
}

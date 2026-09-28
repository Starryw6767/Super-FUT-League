export default async function handler(req, res) {

    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }


    // Get Discord webhook from Vercel Environment Variables
    const webhook = process.env.DISCORD_WEBHOOK;

    if (!webhook) {
        console.error("DISCORD_WEBHOOK is missing.");

        return res.status(500).json({
            error: "Server configuration error."
        });
    }


    const data = req.body || {};


    // Basic validation
    const requiredFields = [
        "discord",
        "age",
        "timezone",
        "activity",
        "hours",
        "experience",
        "positions",
        "football",
        "why",
        "bring",
        "argument",
        "friend",
        "problems",
        "goodstaff",
        "active",
        "rules",
        "ideas",
        "anything"
    ];


    for (const field of requiredFields) {

        if (
            data[field] === undefined ||
            data[field] === null ||
            String(data[field]).trim() === ""
        ) {

            return res.status(400).json({
                error: `Missing field: ${field}`
            });

        }

    }


    // Limit text length
    const clean = (value, max = 1500) => {

        return String(value)
            .trim()
            .slice(0, max);

    };


    // Create Discord embed
    const embed = {

        title: "NEW SFL STAFF APPLICATION",

        description:
            "A new Staff Application has been submitted through the SFL website.",

        color: 16777215,

        fields: [

            {
                name: "Discord Username",
                value: clean(data.discord, 100),
                inline: true
            },

            {
                name: "Age",
                value: clean(data.age, 20),
                inline: true
            },

            {
                name: "Timezone",
                value: clean(data.timezone, 100),
                inline: true
            },

            {
                name: "Discord Activity",
                value: clean(data.activity),
                inline: false
            },

            {
                name: "Hours Per Week",
                value: clean(data.hours, 100),
                inline: true
            },

            {
                name: "Previous Staff Experience",
                value: clean(data.experience),
                inline: false
            },

            {
                name: "Previous Staff Positions",
                value: clean(data.positions),
                inline: false
            },

            {
                name: "Football / FUT Experience",
                value: clean(data.football),
                inline: false
            },

            {
                name: "Why SFL Staff?",
                value: clean(data.why),
                inline: false
            },

            {
                name: "What Would You Bring?",
                value: clean(data.bring),
                inline: false
            },

            {
                name: "Handling Arguments",
                value: clean(data.argument),
                inline: false
            },

            {
                name: "Friend Breaking Rules",
                value: clean(data.friend),
                inline: false
            },

            {
                name: "Repeated Problems",
                value: clean(data.problems),
                inline: false
            },

            {
                name: "What Makes Good Staff?",
                value: clean(data.goodstaff),
                inline: false
            },

            {
                name: "Active When Needed",
                value: clean(data.active, 50),
                inline: true
            },

            {
                name: "Will Follow SFL Rules",
                value: clean(data.rules, 50),
                inline: true
            },

            {
                name: "Ideas For SFL",
                value: clean(data.ideas),
                inline: false
            },

            {
                name: "Anything Else",
                value: clean(data.anything),
                inline: false
            }

        ],

        footer: {
            text: "Super FUT League • SFL Staff Applications"
        },

        timestamp: new Date().toISOString()

    };


    try {

        const discordResponse = await fetch(webhook, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                username: "SFL Applications",

                embeds: [embed]

            })

        });


        if (!discordResponse.ok) {

            const errorText = await discordResponse.text();

            console.error(
                "Discord webhook error:",
                errorText
            );

            return res.status(500).json({
                error: "Could not send application to Discord."
            });

        }


        return res.status(200).json({

            success: true

        });


    } catch (error) {

        console.error(
            "Application error:",
            error
        );

        return res.status(500).json({

            error: "Something went wrong."

        });

    }

}

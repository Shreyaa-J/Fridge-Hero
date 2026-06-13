const recipeBox = document.getElementById("recipeCard");
const loadingText = document.getElementById("loadingText");


const API_KEY = "YOUR_API_KEY";





async function cookMagic() {

    const ingredientOne = document.getElementById("ingredient1").value.trim();
    const ingredientTwo = document.getElementById("ingredient2").value.trim();
    const ingredientThree = document.getElementById("ingredient3").value.trim();

    // Validation
    if (!ingredientOne || !ingredientTwo || !ingredientThree) {
        alert("Please enter all three ingredients before cooking!");
        return;
    }

    const loadingMessages = [
        "🍳 Cooking something magical...",
        "🥗 Mixing ingredients...",
        "👨‍🍳 Creating your special recipe...",
        "✨ Thinking like a master chef..."
    ];

    loadingText.innerText =
        loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

    loadingText.style.display = "block";

    recipeBox.innerHTML = "";

    const prompt = `
You are Fridge Hero, a friendly home chef.

The user has these ingredients:

1. ${ingredientOne}
2. ${ingredientTwo}
3. ${ingredientThree}

Create a simple and realistic recipe using mainly these ingredients.

Requirements:
- Give a creative dish name.
- Write a short description.
- Provide exactly 3 cooking steps.
- Give one serving tip.
- Keep it beginner friendly.

Format the response exactly like this:

🍽 Dish Name:
...

📝 Short Description:
...

👨‍🍳 3-Step Recipe:
1. ...
2. ...
3. ...

💡 Serving Tip:
...
`;

    try {

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log("Gemini Response:", data);

        if (data.error) {
            throw new Error(data.error.message);
        }

        const recipe =
            data.candidates[0].content.parts[0].text;

        recipeBox.innerHTML = `
            <h2>🍽️ Your AI Recipe</h2>
            <div class="recipe-content">
                ${recipe.replace(/\n/g, "<br>")}
            </div>
        `;

        // localStorage.setItem(
        //     "savedRecipe",
        //     recipeBox.innerHTML
        // );

    } catch (error) {

        console.error(error);

        recipeBox.innerHTML = `
            <h3>❌ Recipe Generation Failed</h3>
            <p>${error.message}</p>
        `;
    }

    loadingText.style.display = "none";
}
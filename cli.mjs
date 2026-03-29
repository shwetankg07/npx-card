#!/usr/bin/env node

'use strict';

import boxen from 'boxen';
import chalk from 'chalk';
import inquirer from 'inquirer';
import clear from 'clear';
import open from 'open';
import os from 'os';
import ora from 'ora';
import CFonts from 'cfonts';
import pokemon from 'pokemon';

clear();

CFonts.say('SHWETANK\'S DEN', {
    font: 'block',
    align: 'center',
    colors: ['system'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
    gradient: false,
    independentGradient: false,
    transitionGradient: false,
    env: 'node'
});

const prompt = inquirer.createPromptModule();

// Helper to fetch Cowsay ASCII
const cowSay = async (message) => {
    try {
        const response = await fetch(`https://cowsay.morecode.org/say?message=${encodeURIComponent(message)}&format=text`);
        return await response.text();
    } catch (error) {
        return `\n${message}\n(The cow is tired and couldn't show up)`;
    }
};

const questions = [
    {
        type: "list",
        name: "action",
        message: "What do you want to do?",
        choices: [
            {
                name: `Send me an ${chalk.green.bold("email")}?`,
                value: () => {
                    open("mailto:shwetankg07@gmail.com");
                    console.log("\nDone, see you soon at inbox.\n");
                    main();
                }
            },
            {
                name: `Talk to The ${chalk.white.bold("Cool Cow")}?`,
                value: async () => {
                    const cowPrompt = inquirer.createPromptModule();
                    const choice = await cowPrompt([
                        {
                            type: "list",
                            name: "subAction",
                            message: "What should the cow do?",
                            choices: ["Tell a Joke", "Tell a Useless Fact", "Say what I want", "Back to Menu"]
                        }
                    ]);

                    if (choice.subAction === "Back to Menu") {
                        return main();
                    }

                    let message = "";
                    const spinner = ora(chalk.cyan("The cow is thinking...")).start();

                    try {
                        if (choice.subAction === "Tell a Joke") {
                            const res = await fetch("https://official-joke-api.appspot.com/random_joke");
                            const joke = await res.json();
                            message = `${joke.setup} ... ${joke.punchline}`;
                        } else if (choice.subAction === "Tell a Useless Fact") {
                            const res = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en");
                            const data = await res.json();
                            message = data.text;
                        } else if (choice.subAction === "Say what I want") {
                            spinner.stop();
                            const input = await cowPrompt([{ type: "input", name: "msg", message: "What should the cow say?", default: "Moo!" }]);
                            message = input.msg;
                            spinner.start(chalk.cyan("Processing..."));
                        }

                        const cowOutput = await cowSay(message);
                        spinner.stop();
                        console.log("\n" + chalk.gray(cowOutput) + "\n");
                    } catch (error) {
                        spinner.fail(chalk.red("The cow got stage fright."));
                    }

                    await new Promise(r => setTimeout(r, 2000));
                    main();
                }
            },
            {
                name: `Get ${chalk.white.bold("Hacked")}?`,
                value: async () => {
                    const spinner = ora(chalk.green("Initializing system scan...")).start();
                    
                    setTimeout(() => {
                        spinner.color = 'yellow';
                        spinner.text = chalk.yellow("Bypassing firewalls...");
                    }, 1000);

                    setTimeout(() => {
                        spinner.color = 'red';
                        spinner.text = chalk.red("Accessing mainframe...");
                    }, 2000);

                    await new Promise(resolve => {
                        setTimeout(async () => {
                            spinner.stop();
                            console.log(chalk.white.bold("\n--- SYSTEM DATA RETRIEVED ---"));
                            
                            const networkInterfaces = os.networkInterfaces();
                            const ipAddress = Object.values(networkInterfaces)
                                .flat()
                                .find(details => details.family === 'IPv4' && !details.internal)?.address || '127.0.0.1';

                            const lines = [
                                chalk.white(`OS: ${os.platform()} (${os.arch()})`),
                                chalk.white(`User: ${os.userInfo().username}`),
                                chalk.white(`Local IP: ${chalk.dim(ipAddress)}`),
                                chalk.white(`System Memory: ${((os.totalmem() - os.freemem()) / (1024 * 1024 * 1024)).toFixed(2)} GB / ${(os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)} GB`),
                                chalk.white(`Uptime: ${(os.uptime() / 3600).toFixed(2)} hours`),
                                chalk.white(`CPU: ${os.cpus()[0].model}`),
                                chalk.white.bold("-----------------------------")
                            ];

                            for (const line of lines) {
                                await new Promise(r => setTimeout(r, 800));
                                console.log(line);
                            }

                            setTimeout(() => {
                                console.log(chalk.white("\n Just some basic OS info. You have been forgiven.\n"));
                                main();
                            }, 1000);
                            resolve();
                        }, 3500);
                    });
                }
            },
            {
                name: `Open ${chalk.yellow.bold("PokeDex")}?`,
                value: async () => {
                    const pokePrompt = inquirer.createPromptModule();
                    const choice = await pokePrompt([
                        {
                            type: "list",
                            name: "subAction",
                            message: "What do you want to do?",
                            choices: ["Search by Name", "Get a Random Pokemon(the pokemon will show up if you're lucky)", "Back to Menu"]
                        }
                    ]);

                    if (choice.subAction === "Back to Menu") {
                        return main();
                    }

                    let pokeName = "";
                    if (choice.subAction === "Search by Name") {
                        const input = await pokePrompt([
                            {
                                type: "input",
                                name: "name",
                                message: "Enter Pokemon Name:",
                                validate: (val) => {
                                    try {
                                        pokemon.getId(val.charAt(0).toUpperCase() + val.slice(1).toLowerCase());
                                        return true;
                                    } catch (e) {
                                        return "Pokemon not found! Try again.";
                                    }
                                }
                            }
                        ]);
                        pokeName = input.name.charAt(0).toUpperCase() + input.name.slice(1).toLowerCase();
                    } else {
                        pokeName = pokemon.random();
                    }

                    const spinner = ora(chalk.cyan(`Fetching data for ${pokeName}...`)).start();

                    try {
                        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName.toLowerCase()}`);
                        const data = await res.json();
                        
                        // Fetch Compact ASCII Art
                        const paddedId = String(data.id).padStart(3, '0');
                        let asciiArt = "";
                        try {
                            // Using the "compact" versions which are much smaller and fit the screen
                            const asciiRes = await fetch(`https://raw.githubusercontent.com/shinya/pokemon-terminal-art/main/compact/256color/diamond/${paddedId}.txt`);
                            if (asciiRes.ok) {
                                asciiArt = await asciiRes.text();
                            }
                        } catch (e) {
                            // Fallback
                        }

                        spinner.stop();

                        if (asciiArt) {
                            console.log(asciiArt);
                        }

                        const stats = data.stats.map(s => `${chalk.bold(s.stat.name.toUpperCase())}: ${s.base_stat}`).join(" | ");
                        const types = data.types.map(t => chalk.magenta(t.type.name)).join(", ");

                        const pokeCard = boxen(
                            [
                                `${chalk.yellow.bold("ID:")} ${data.id}`,
                                `${chalk.yellow.bold("Type:")} ${types}`,
                                `${chalk.yellow.bold("Height:")} ${data.height / 10}m`,
                                `${chalk.yellow.bold("Weight:")} ${data.weight / 10}kg`,
                                ``,
                                `${chalk.cyan.bold("Base Stats:")}`,
                                stats
                            ].join("\n"),
                            {
                                padding: 1,
                                borderStyle: "round",
                                borderColor: "yellow",
                                title: pokeName,
                                titleAlignment: "center"
                            }
                        );
                        console.log(pokeCard);
                    } catch (error) {
                        spinner.fail(chalk.red("Failed to catch that Pokemon. It escaped!"));
                    }

                    await new Promise(r => setTimeout(r, 2000));
                    main();
                }
            },
            {
                name: "Quit(atleast be my friend ;-;)",
                value: () => {
                    console.log("Hasta la vista, babyy.\n");
                    process.exit();
                }
            }
        ]
    }
];

const data = {
    name: chalk.bold.white("Shwetank"),
    handle: chalk.dim("@shwetank"),
    instagram: chalk.gray("https://instagram.com/") + chalk.dim("shwetank._.gupta"),
    github: chalk.gray("https://github.com/") + chalk.dim("shwetankg07"),
    linkedin: chalk.gray("https://linkedin.com/in/") + chalk.dim("shwetankg07"),
    npx: chalk.white("npx") + " " + chalk.dim("shwetank"),
    labelInstagram: chalk.white.bold("Instagram:"),
    labelGitHub: chalk.white.bold("GitHub:"),
    labelLinkedIn: chalk.white.bold("LinkedIn:"),
    labelCard: chalk.white.bold("Card:")
};

const me = boxen(
    [
        `${data.name}`,
        ``,
        `${data.labelInstagram}  ${data.instagram}`,
        `${data.labelGitHub}  ${data.github}`,
        `${data.labelLinkedIn}  ${data.linkedin}`,
        ``,
        `${data.labelCard}  ${data.npx}`,
        ``,
        `${chalk.italic("Welcome to the Den! I'm a first-year dev currently")}`,
        `${chalk.italic("obsessed with building cool things and breaking them.")}`,
        `${chalk.italic("Whether you have a project idea, a Pokemon tip, or")}`,
        `${chalk.italic("just want to say hi—my inbox is always open!")}`
    ].join("\n"),
    {
        margin: 1,
        float: 'center',
        padding: 1,
        borderStyle: "single",
        borderColor: "white"
    }
);

console.log(me);

const tip = [
    `Tip: Try ${chalk.white.bold("cmd/ctrl + click")} on the links above`,
    '',
].join("\n");

console.log(tip);

const main = () => {
    prompt(questions).then(answer => {
        if (answer.action) {
            answer.action();
        }
    });
};

main();

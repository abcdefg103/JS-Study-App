import chalk from 'chalk';
import inquirer from 'inquirer'
import gradient from 'gradient-string'
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner'
import fs from "fs";
import readLine from "readline";
var questions = [];

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
async function questioning() {
    const rainbowTitle = chalkAnimation.karaoke('Questions')
    await sleep()
    rainbowTitle.stop()
    const answer = await inquirer.prompt({
        name: 'option',
        type: 'input',
        message: 'Enter a path to a file(needs txt file)'
    })
    const spinner = createSpinner("Checking File Input...").start();
    await sleep(1000)
    if (!answer.option.endsWith(".txt")) {
        spinner.error({ text: `Not valid`})
        process.exit(1)
    }
    try {
        var data = readLine.createInterface({
            input : fs.createReadStream(answer.option),
            output : process.stdout,
            terminal: false
        });
    }
    catch (err) {
        spinner.error({ text: `${err}`})
        process.exit(1)
    }
    spinner.success({ text: "Success" })
    data.on('line', text => {
        if (!Boolean(text)) {
            return
        }
        questions.push(text.toUpperCase().trim())
    })
    const spinner3 = createSpinner("Loading...").start()

    setTimeout( () => {
        spinner3.success()
        second()
    }, 2000)

}
async function second() {
    var wrongtimes = 0;
    var answerednum = JSON.parse(JSON.stringify(questions))
    await sleep(1000)
    console.clear()
    while(answerednum.length > 0) {
        console.log(chalk.bgBlue("Things you already got"))
        console.table(questions.filter(f => !answerednum.includes(f)))
        console.log(answerednum.length, "remaining")
        var answernow = await inquirer.prompt({
            name: 'ansnow',
            type: 'input',
            message: 'Type things(quitquit to quit)'
        })
        var spinner2 = createSpinner("Checking").start()
        await sleep(500)
        var curindex = answerednum.indexOf(answernow.ansnow.toUpperCase().trim())
        if (answernow.ansnow === "quitquit") {
            spinner2.warn()
            break
        }
        else if (curindex < 0) {
            spinner2.error("Wrong! Not in the list.")
            wrongtimes++
        }
        else {
            spinner2.success()
            answerednum.splice(curindex, 1);
            console.clear()
        }

    }
    if (answerednum.length === 0){
        figlet('Great Job!!!', (err, data) => {
            console.log(gradient.rainbow.multiline(data))
        });

        console.log("Time to get an A on the test!")
        console.log("Number of failures: ", wrongtimes)
    }
    else {
        console.clear()
        console.log(answerednum)
        console.log(`You got ${questions.length-answerednum.length} correct. Try again!`)
        console.log("Number of failures: ", wrongtimes)
    }

}
await questioning()
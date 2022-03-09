
import chalk from 'chalk'
import fs from 'fs'
const BASE = 'D:/work/test'
const MIAN_DEST = `${BASE}/src/main/resources/static/`
const JS_DEST = `${BASE}/src/main/resources/static/js/`
const CSS_DEST = `${BASE}/src/main/resources/static/css/`
const IMAGE_DEST = `${BASE}/src/main/resources/static/images/`
const js = fs.readdirSync('./dist/js')
const css = fs.readdirSync('./dist/css')
const images = fs.readdirSync('./dist/images')
function error(msg){
    console.log(chalk.yellow('ERROR:'),chalk.red(msg));
}
fs.copyFile('./dist/login.html',MIAN_DEST+'login.html',(err)=>{
    if(err){
        error(err.toString())
    }else{
        console.log(chalh.yellow('index.html:') + chalk.green('执行复制动作完成'));
    }
})
fs.copyFile('./dist/index.html',MIAN_DEST+'index.html',(err)=>{
    if(err){
        error(err.toString())
    }else{
        console.log(chalh.yellow('login.html:') + chalk.green('执行复制动作完成'));
    }
})
js.forEach(item=>{
    fs.copyFile('./dist/js/'+item,JS_DEST+item,(err)=>{
        if(err){
            error(err.toString())
        }else{
            console.log(chalh.yellow('js:') + chalk.green('执行复制动作完成'));
        }
    })
})
css.forEach(item=>{
    fs.copyFile('./dist/css/'+item,CSS_DEST+item,()=>{
        if(err){
            error(err.toString())
        }else{
            console.log(chalh.yellow('css:') + chalk.green('执行复制动作完成'));
        }
    })
})
images.forEach(item=>{
    fs.copyFile('./dist/images/'+item,IMAGE_DEST+item,()=>{
        if(err){
            error(err.toString())
        }else{
            console.log(chalh.yellow('images:') + chalk.green('执行复制动作完成'));
        }
    })
})



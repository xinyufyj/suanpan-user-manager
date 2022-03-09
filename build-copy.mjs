
import chalk from 'chalk'
import fs from 'fs'
const MIAN_DEST = 'D:/work/test/src/main/resources/static/'
const JS_DEST = 'D:/work/test/src/main/resources/static/js/'
const CSS_DEST = 'D:/work/test/src/main/resources/static/css/'
const IMAGE_DEST = 'D:/work/test/src/main/resources/static/images/'
const js = fs.readdirSync('./dist/js')
const css = fs.readdirSync('./dist/css')
const images = fs.readdirSync('./dist/images')
function error(msg){
    console.log(chalk.yellow('ERROR:'),chalk.red(msg));
}
fs.copyFile('./dist/login.html',MIAN_DEST+'login.html',()=>{
    if(err){
        error(err.toString())
    }
})
fs.copyFile('./dist/index.html',MIAN_DEST+'index.html',()=>{
    if(err){
        error(err.toString())
    }
})
js.forEach(item=>{
    fs.copyFile('./dist/js/'+item,JS_DEST+item,(err)=>{
        if(err){
            error(err.toString())
        }
    })
})
css.forEach(item=>{
    fs.copyFile('./dist/css/'+item,CSS_DEST+item,()=>{
        if(err){
            error(err.toString())
        }
    })
})
images.forEach(item=>{
    fs.copyFile('./dist/images/'+item,IMAGE_DEST+item,()=>{
        if(err){
            error(err.toString())
        }
    })
})
console.log(chalk.green('执行复制动作完成'));


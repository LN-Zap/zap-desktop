# Troubleshooting Common Issues
## Compiling/ Development issues
### Blank screen running "npm run dev" or "yarn dev"
If you are experiencing blank screen after launching in development mode, check javascript console.

If you have errors like:

```
Uncaught TypeError: Cannot read property 'state' of undefined
   at unliftState (<anonymous>:2:31678)
   at Object.getState (<anonymous>:2:31745)
   at Object.runComponentSelector [as run] (connectAdvanced.js:37)
   at ProxyComponent.initSelector (connectAdvanced.js:196)
   at ProxyComponent.initSelector (react-hot-loader.development.js:693)
   at new Connect (connectAdvanced.js:134)
   at new Connect(IntlProvider) (eval at ./node_modules/react-hot-loader/dist/react-hot-loader.development.js (http://localhost:1212/dist/main.js:42330:54), <anonymous>:5:7)
   at constructClassInstance (react-dom.development.js:12628)
   at updateClassComponent (react-dom.development.js:14480)
   at beginWork (react-dom.development.js:15335)
```

can be related to some incompatible extensions loaded in Electrum. 

Try to delete Electron folder.

On OSX that would be:
```
  rm -rf ~/Library/Application\ Support/Electron
```

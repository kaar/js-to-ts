# JS -> TS

## Usage
```bash
cat examples/App.js | python ts_to_js/main.py > examples/App.ts
```


## Possible improvements
* More descriptive instructions
* Add example messages that does js -> ts conversion the "right way"
* Send multiple files in the same request
* Surround the js script data with
```js
const javascrpt_code = 42
```
* Send the folder structure of the app
```bash
tree .
```

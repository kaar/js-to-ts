# JS -> TS

## Install
Requires [pipx](https://github.com/pypa/pipx)

```bash
git clone https://github.com/kaar/js-to-ts
pipx install .
```

## Usage
```bash
# stdin input
cat examples/App.js | python ts_to_js/main.py > examples/App.ts
# File input
python ts_to_js/main.py examples/App.js > examples/App-2.ts
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

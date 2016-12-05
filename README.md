leo-react-autocomplete   [Demo](http://leohuiyi.github.io/leoCode.html?htmlUrl=./leoCodeDemo/leo-react-autocomplete/index.html)
============

reac-autocomplete组件（支持虚拟dom可支持几万条数据匹配）.


## Demo & Examples



```javascript
import React from "react";
import ReactDOM from "react-dom";
import Autocomplete from "./js/Autocomplete.js";

function getData(num){
    let arr = [];

    while(num --){
        arr.push({
            key: num,
            value: `leo${num}`
        });
    }

    return arr;
}

ReactDOM.render(
    <Autocomplete
        width={396}
        data={getData(10000)}
        filter={(data, search, value, label)=> {
            return data = data.filter((item)=> {
                return item[value].indexOf(search) > -1;
            });
        }}
        menuStyle={{'maxHeight': '200px'}}
    />,
    document.getElementById('content')
);
```

### Further options

	Property	|	Type		|	Default		|	Description
:-----------------------|:--------------|:--------------|:--------------------------------
data	|	array	|	[]	|	数据源
visible	|	bool	|	false	|	首次显示
width	|	number	|	200	|	宽
style	|	object	|	{}	|	autocomplete style
value	|	any	|	false	|	value
label	|	any	|	false	|	label
placeholder	|	string	|	''	|	input placeholder
labelName	|	string	|	'key	|	labelName
valueName	|	string	|	'value'	|	valueName
menuStyle	|	object	|	{}	|	menuStyle
onSelect	|	func	|	noop	|	onSelect
onBlur	|	func	|	noop	|	onSelect
onTab	|	func	|	noop	|	onTab
listHeight	|	number	|	30	|	listHeight
virtualMinLen	|	number	|	30	|	大于多少条数据使用虚拟dom
filter	|	string || func	|	'value'	|	filter


# License

MIT Licensed. Copyright (c) leoHuiyi 2015.

module.exports = {
	"extends": ["tslint-config-airbnb"],
	"jsRules": {},
	"rules": {
		"indent": [true, "spaces", 2],
		"align": [true, "parameters", "statements"], // 这个就是会让函数调用参数自动对齐的sb配置
		"ter-indent": [true, 2, { "SwitchCase": 1 }],
		"import-name": false,
		"variable-name": [true, "ban-keywords", "check-format", "allow-leading-underscore", "allow-pascal-case"],
		"function-name": false,
		"max-line-length": [true, 100],
		"no-increment-decrement": false,
	},
	"rulesDirectory": [],
	"linterOptions": {
		"exclude": ["node_modules", "src/**/*.test.*"]
	}
}

# ansi-marker README

This extention let you see how an ansi code will show on the console, use in ansi-color lib

## Usage

Once this extention is install all you need to do is add key-mark to you line of code

```javascript
//Ansi [flags] msg
```

inside the flags you can use the fallowing flags

-   color
-   bg-color
-   bold
-   italic
-   underline
-   strikethrough

> Note: color can have value for both normal and bright colors

## Example

```javascript
const a = 31; //Ansi [color 31 bold] Hello, World
```

msg will look like this <span style="color:rgba(205,49,49,1); font-weight:bold;">Hello, World</span>

import React from "../src";
import { Component } from "../src/component";
import { useContext } from '../src/hooks'

// const Theme = React.createContext('light');
// function ThemedButton(props) {
//     return (
//         <Theme.Consumer>
//             {theme => {
//                 return <button {...props} className={'btn ' + theme}>{theme}</button>;
//             }}
//         </Theme.Consumer>
//     );
// }
// 



const themes = {
    light: {
        name: 'light'
    },
    dark: {
        name: 'dark'
    }
};


const ThemeContext = React.createContext(themes.dark);
// function ThemedButton() {
//     const theme = useContext(ThemeContext);
//     return (
//         <button style={{ background: theme.background, color: theme.foreground }}>
//             I am styled by theme context!
//         </button>
//     );
// }

class ThemedButton extends React.Component {
    render() {
        console.log('子元素重渲染', ThemeContext)
        let props = this.props;
        return (
            <ThemeContext.Consumer>
                {theme => {
                    return <button
                        {...props}
                    >{theme.name}</button>;
                }}
            </ThemeContext.Consumer>

        );
    }
}

function Toolbar(props) {
    return (
        <ThemedButton onClick={props.changeTheme}>
            Change Theme
        </ThemedButton>
    );
}

class App extends Component {
    state = {
        theme: themes.dark
    }
    toggleTheme = () => {
        this.setState(state => ({
            theme:
                state.theme === themes.dark
                    ? themes.light
                    : themes.dark,
        }));
    }
    render() {
        return (
            <>
                <ThemeContext.Provider value={this.state.theme}>
                    <Toolbar changeTheme={this.toggleTheme} />
                    <div>{this.state.theme}</div>
                </ThemeContext.Provider>
            </>
        );

    }
}


const root = document.querySelector('#root')
React.render(<App />, root)

import {render, screen} from '@testing-library/react';
import App from '.App';

test('renders learn react link', () =>{ //description
    render(<App/>); //render component
    const linkElement = screen.getByText(/CoSMo User Interface/i); //select a specific html element
    expect(linkElement).toBeInTheDocument(); //expected result
});
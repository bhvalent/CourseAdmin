import React from 'react';
import { mount } from 'enzyme';
import { authors, newCourse, courses } from '../../../tools/mockData';
import { ManageCoursePage } from './ManageCoursePage';

function render(args) {
    const defaultProps = {
        authors,
        courses,
        // Passed from Ract Router in real app, so just stubbing in for test.
        // Could also choose to use MemoryRouter as shown in Header.test.js,
        // or even wrap with React Router, depending on whether I 
        // need to test React Router related behavior
        history: {},
        saveCourse: jest.fn(),
        loadAuthors: jest.fn(),
        loadCourses: jest.fn(),
        course: newCourse,
        match: {}
    };

    const props = { ...defaultProps, ...args };

    return mount(<ManageCoursePage { ...props } />);
    // This is one option in testing a connected componenent. 
    // return mount(<Provider store={ store }><ManageCoursePage { ...props } /></Provider>);
    // The other option which is implemented is putting export before the function (to export the unconnected component)
    
}

it('sets error when attempting to save an empty title field', () => {
    const wrapper = render();
    wrapper.find("form").simulate("submit");
    const error = wrapper.find(".alert").first();
    expect(error.text()).toBe("Title is required.");
});
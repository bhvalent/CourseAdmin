import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as courseActions from '../../redux/actions/courseActions';
import PropTypes from 'prop-types';
import CourseList from './CourseList';
import * as authorActions from '../../redux/actions/authorActions';
import { Redirect } from 'react-router-dom';
import Spinner from '../common/Spinner';
import { toast } from 'react-toastify';

function CoursesPage({ authors, courses, loadCourses, loadAuthors, loading }) {
    const [ redirectToAddCoursePage, setRedirectToAddPage ] = useState(false);

    useEffect(() => {
        if (courses.length === 0) {
            loadCourses().catch(error => {
                alert("Loading courses failed" + error)
            });
        }

        if (authors.length === 0) {
            loadAuthors().catch(error => {
                alert("Loading authors failed" + error)
            });
        }
    }, []);

    async function handleDeleteCourse(course) {
        toast.success("Course deleted.");
        try {
            await this.props.actions.deleteCourse(course);
        } catch (error) {
            toast.error("Delete failed. " + error.message, { autoClose: false });
        }
    } 

    return (
        <>
            { redirectToAddCoursePage && <Redirect to="/course" /> }
            <h2>Courses</h2>
            { loading ? (
                    <Spinner />
                ) : (
                    <>
                        <button
                            style={{ marginBottom: 20 }}
                            className="btn btn-primary add-course"
                            onClick={() => setRedirectToAddPage(true)}
                        >
                                Add Course
                        </button>

                        <CourseList onDeleteClick={ handleDeleteCourse } courses={ courses } />
                    </>
                )
            }
        </>
    ); 
    
}

CoursesPage.propTypes = {
    courses: PropTypes.array.isRequired,
    authors: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    loadAuthors: PropTypes.func.isRequired,
    loadCourses: PropTypes.func.isRequired,
    deleteCourse: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        courses: state.authors.length === 0 
            ? [] 
            : state.courses.map(course => {
                return {
                    ...course,
                    authorName: state.authors.find(a => a.id === course.authorId).name
                };
        }),
        authors: state.authors,
        loading: state.apiCallsInProgress > 0
    };
}

const mapDispatchToProps = {
    loadCourses: courseActions.loadCourses,
    loadAuthors: authorActions.loadAuthors,
    deleteCourse: courseActions.deleteCourse
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
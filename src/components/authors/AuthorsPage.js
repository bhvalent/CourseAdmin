import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import * as authorActions from '../../redux/actions/authorActions';
import AuthorList from './AuthorList';
import { toast } from 'react-toastify';
import PropTypes from "prop-types";
import Spinner from '../common/Spinner';
import { Redirect } from 'react-router-dom';

function AuthorsPage({ loadAuthors, authors, deleteAuthor, loading }) {
    const [ redirectToAddCoursePage, setRedirectToAddPage ] = useState(false);

    useEffect(() => {
        if (authors.length === 0) {
			loadAuthors().catch(error => {
				alert("Loading authors failed" + error);
			});
		}
    }, []);

    async function handleDeleteAuthor(author) {
        toast.success("Course deleted.");
        try {
            await deleteAuthor(author);
        } catch (error) {
            toast.error("Delete failed. " + error.message, { autoClose: false });
        }
    }

    return (
        <>
            { redirectToAddCoursePage && <Redirect to="/author" /> }
            <h2>Authors</h2>
            { loading ? (
                    <Spinner />
                ) : (
                    <>
                        <button
                                style={{ marginBottom: 20 }}
                                className="btn btn-primary"
                                onClick={() => setRedirectToAddPage(true)}
                        >
                            Add Author
                        </button>
                        <AuthorList onDeleteClick={ handleDeleteAuthor } authors={ authors } />
                    </>
                )
            }
        </>
    );
}

AuthorsPage.propTypes = {
    loadAuthors: PropTypes.func.isRequired,
    authors: PropTypes.array.isRequired,
    deleteAuthor: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
    return {
        authors: state.authors,
        loading: state.apiCallsInProgress > 0
    };
}

const mapDispatchToProps = {
    loadAuthors: authorActions.loadAuthors,
    deleteAuthor: authorActions.deleteAuthor
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthorsPage);
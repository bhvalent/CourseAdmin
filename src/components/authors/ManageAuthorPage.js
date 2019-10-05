import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import AuthorForm from './AuthorForm';
import { newAuthor } from '../../../tools/mockData';
import PropTypes from "prop-types";
import { toast } from 'react-toastify';
import * as authorActions from '../../redux/actions/authorActions';
import Spinner from '../common/Spinner';

function ManageAuthorPage({ saveAuthor, history, loadAuthors, authors, ...props }) {
    const [ author, setAuthor ] = useState({ ...props.author });
    const [ errors, setErrors ] = useState({});
    const [ saving, setSaving ] = useState(false);

    useEffect(() => {
        if (authors.length === 0) {
			loadAuthors().catch(error => {
				alert("Loading authors failed" + error);
			});
		} else {
            setAuthor({ ...props.author });
        }
    }, [props.author]);

    function handleChange(event) {
		const { name, value } = event.target;
		setAuthor( prevAuthor => ({
			...prevAuthor,
			[name]: value
		}));
    }

    function formIsValid() {
		const { name } = author;
		const errors = {};

		if (!name) errors.title = "Name is required.";
		setErrors(errors);
		
		return Object.keys(errors).length === 0;
	}
    
    function handleSave(event) {
        event.preventDefault();
        if (!formIsValid()) return;
        setSaving(true);
        saveAuthor(author).then(() => {
            toast.success("Author saved.");
			history.push("/authors");
        }).catch(error => {
            setSaving(false);
			setErrors({ onSave: error.message });
        })
    }

    debugger;

    return authors.length === 0 ? (
        <Spinner />
    ) : (
        <AuthorForm 
            author={ author } 
            errors={ errors } 
            onChange={ handleChange } 
            onSave={ handleSave } 
            saving={ saving }
        />
    );
}

ManageAuthorPage.propTypes = {
    saveAuthor: PropTypes.func.isRequired,
    author: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    loadAuthors: PropTypes.func.isRequired,
    authors: PropTypes.array.isRequired
}

function getAuthorBySlug(authors, slug) {
    debugger;
	return authors.find(author => author.slug === slug) || null;
}

function mapStateToProps(state, ownProps) {
    const slug = ownProps.match.params.slug;
	const author = slug && state.authors.length > 0 ? getAuthorBySlug(state.authors, slug) : newAuthor;
    return {
        author,
        authors: state.authors
    }
}

const mapDispatchToProps = {
    loadAuthors: authorActions.loadAuthors,
    saveAuthor: authorActions.saveAuthor
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageAuthorPage);
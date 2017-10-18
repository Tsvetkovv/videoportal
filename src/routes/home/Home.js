import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import Link from '../../components/Link';

class Home extends React.Component {
  static propTypes = {
    homeData: PropTypes.shape({
      categories: PropTypes.arrayOf(
        PropTypes.shape({
          content: PropTypes.arrayOf(
            PropTypes.shape({
              title: PropTypes.string.isRequired,
              url: PropTypes.string.isRequired,
              author: PropTypes.string.isRequired,
              rating: PropTypes.number.isRequired,
            }),
          ),
          title: PropTypes.string.isRequired,
        }),
      ),
    }).isRequired,
  };

  render() {
    const { homeData: { categories } } = this.props;

    return (
      <div className={s.root}>
        <div className={s.container}>
          {categories.map(category => (
            <article key={category.title} className={s.newsItem}>
              <h1 className={s.newsTitle}>{category.title}</h1>
              <div className={s.videosContainer}>
                {category.content.map(video => (
                  <div className={s.video}>
                    <div className={s.videoSrc} />
                    <a>{video.title}</a>
                    <Link to="/user">{video.author}</Link>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);

// Card — displays a movie poster, title and year. Props: { movie: { _id, title, poster, year } }
import './Card.scss'

const Card = ({ movie }) => (
  <article className="card">
    <img className="card__poster" src={movie.poster} alt={movie.title} />
    <h3 className="card__title">{movie.title}</h3>
    <span className="card__year">{movie.year}</span>
  </article>
)

export default Card

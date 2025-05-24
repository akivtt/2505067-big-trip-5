import FormEditing from '../view/form-editing-view.js';
import { render, remove, RenderPosition } from '../framework/render';
import { UserAction, UpdateType } from '../consts.js';

export default class PointCreationPresenter {
  #pointListComponent = null;
  #pointEditComponent = null;
  #filterModel = null;
  #addButton = document.querySelector('.trip-main__event-add-btn');
  #point = null;
  #typeOffers = null;
  #offers = null;
  #destinations = null;
  #handleDataChange = null;
  #handleModeChange = null;

  constructor({ filterModel, pointListComponent, point, typeOffers, offers, destinations, handleDataChange, handleModeChange }) {
    this.#filterModel = filterModel;
    this.#pointListComponent = pointListComponent;
    this.#point = point;
    this.#typeOffers = typeOffers;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleDataChange = handleDataChange;
    this.#handleModeChange = handleModeChange;

    this.#addButton.addEventListener('click', this.#handleAddButtonClick);
  }

  init() {
    this.#pointEditComponent = new FormEditing({
      point: this.#point,
      typeOffers: this.#typeOffers,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit.bind(this),
      onDeleteClick: this.destroy
    });

    render(this.#pointEditComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #handleAddButtonClick = () => {
    this.#handleModeChange();
    document.addEventListener('keydown', this.#onEscKeydown);
    this.init();
    this.#addButton.disabled = true;
  };

  #handleFormSubmit = (update) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      update
    );
    this.#filterModel.setFilter(UpdateType.MAJOR, 'everything');
    document.removeEventListener('keydown', this.#onEscKeydown);
    this.destroy();
  };

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
      document.removeEventListener('keydown', this.#onEscKeydown);
    }
  };

  destroy = () => {
    remove(this.#pointEditComponent);
    this.#addButton.disabled = false;
  };
}

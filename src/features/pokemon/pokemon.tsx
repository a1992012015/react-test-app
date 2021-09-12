import React from 'react';

import styles from './pokemon.module.less';
import { useGetPokemonByNameQuery } from '../../services/pokemon.service';
import { BaseComponent } from '../../components/should-component-update';

const pokemon = ['bulbasaur', 'pikachu', 'ditto', 'bulbasaur'];

interface Props {
  name: string;
}

const PokemonItem = ({ name }: Props): JSX.Element | null => {
  const pollingInterval = 0;
  const { data, error, isLoading, isFetching } = useGetPokemonByNameQuery(name, {
    pollingInterval
  });
  if (error) {
    return <React.Fragment>Oh no, there was an error</React.Fragment>;
  }
  if (isLoading) {
    return <React.Fragment>Loading...</React.Fragment>;
  }
  if (data) {
    return (
      <React.Fragment>
        <h3>
          {data.species.name} {isFetching ? '...' : ''}
        </h3>
        <img src={data.sprites.front_shiny} alt={data.species.name} />
      </React.Fragment>
    );
  }
  return null;
};

export class Pokemon extends BaseComponent {
  render(): React.ReactNode {
    return <div className={styles.container}>{this.renderPokemon()}</div>;
  }

  renderPokemon = (): React.ReactNode => {
    return pokemon.map((poke, index) => {
      return (
        <div key={index}>
          <PokemonItem name={poke} />
        </div>
      );
    });
  };
}

import React from 'react';

import styles from './pokemon.module.less';
import { useGetPokemonByNameQuery } from '../../services/pokemon.service';
import { BaseComponent } from '../../components/should-component-update';

const pokemon = ['bulbasaur', 'pikachu', 'ditto', 'bulbasaur'];

interface Props {
  name: string;
}

export function PokemonItem({ name }: Props) {
  const pollingInterval = 0;
  const { data, error, isLoading, isFetching } = useGetPokemonByNameQuery(
    name, { pollingInterval }
  );

  return (
    <div>
      {error ? (
        <>Oh no, there was an error</>
      ) : isLoading ? (
        <>Loading...</>
      ) : data ? (
        <>
          <h3>
            {data.species.name} {isFetching ? '...' : ''}
          </h3>
          <img src={data.sprites.front_shiny} alt={data.species.name}/>
        </>
      ) : null}
    </div>
  );
}

export class Pokemon extends BaseComponent {

  render() {
    return (
      <div className={styles.container}>
        {this.renderPokemon()}
      </div>
    );
  }

  renderPokemon() {
    return pokemon.map((poke, index) => (
      <PokemonItem key={index} name={poke}/>
    ));
  }
}

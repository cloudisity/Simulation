from random import *

# You'll also need functions to check if files exist and are readable.
from os.path import isfile
from os import access, R_OK

######################################################################
# Helper function to determine whether an agent adopts a behavior (e.g., vaccination, masking)
def helper(p):
    return (flip(p) and random()) or 0

######################################################################
# Specification: flip(p) flips a (weighted) coin. Returns True if a
# randomly generated float between 0 and 1 (inclusive) is less than or
# equal to the specified probability p.
#
def flip(p=0.5):
    return random() <= p

######################################################################
# Specification: binnedSample(k, N) produces a set (of size specified
# by k) of random integers selected without replacement from a range
# specified by N.
def binnedSample(k, N):
    if isinstance(k, int) and isinstance(N, int): 
        return set(sample(range(N), k))
    elif isinstance(N, tuple) and isinstance(k, int):
        return set(sample(range(sum(N)), k)) 
    elif isinstance(k, tuple) and isinstance(N, tuple) and len(k) == len(N):
        return set(sample(range(sum(N)), sum(k)))
    else:
        print("Warning... binnedSample called with nonsensical arguments")
        return set()

######################################################################
# Specification: newPop(config) creates a new population of agents.
# Returns a tuple of agent dictionaries, where I agents, selected at
# random, are initially infected (disease state = di+de+1); all other
# agents are marked as susceptible (disease state = -1). 
def newPop(config):
    # Determine if N and I are tuples, and convert to tuple if not
    N = (config['N'],) if not isinstance(config['N'], tuple) else config['N']
    I = (config['I'],) if not isinstance(config['I'], tuple) else config['I']

    # Generate a population
    pop = []
    if isinstance(N, tuple) and len(N) > 1:
        # Handling subpopulations
        type_index = 0
        for n in N:
            for _ in range(n):
                pop.append({
                    'state': -1,
                    'vaccine': helper(config['vp']),
                    'mask': helper(config['mp']),
                    'type': type_index
                })
            type_index += 1
    else:
        # Generate a population without subpopulations
        pop = [
            {
                'state': -1,
                'vaccine': helper(config['vp']),
                'mask': helper(config['mp'])
            } for i in range(N[0])
        ]

    # Select initial infected agents
    inf = set()
    if isinstance(I, tuple) and len(I) == len(N):
        # Start index for each group
        start_index = 0
        for idx, group_size in enumerate(N):
            subgroup_range = range(start_index, start_index + group_size)
            inf.update(sample(subgroup_range, I[idx]))
            start_index += group_size
    else:
        inf = set(sample(range(len(pop)), I[0]))

    # Initialize infected agents
    for i in inf:
        pop[i]['state'] = config['di'] + config['de'] + 1
        if flip(config['ap']):
            pop[i]['sociso'] = 0.0
        else:
            pop[i]['sociso'] = helper(config['ip'])

    return (pop, inf)

######################################################################
# Specification: update(pop, config) updates each agent’s infection status.
def update(pop, inf, config):
    drop = set()   # Agents recovered or susceptible this round
    for i in inf:
        if pop[i]['state'] == 1:
            pop[i]['state'] = (flip(1-config['rp']) and -1) or 0
            drop.add(i)
        elif pop[i]['state'] > 0:
            pop[i]['state'] = pop[i]['state'] - 1
    # Cleanup infected set
    inf = inf - drop
    return inf

######################################################################
# Specification: sim(config) runs the simulation and returns a list of infections per day.
def sim(config):
    # Default configuration
    default_config = {
        'N': 100, 'I': 1, 'm': 4, 'de': 3, 'di': 5,
        'tpe': 0.01, 'tpi': 0.02, 'rp': 0.5,
        'vp': 0.9, 'mp': 0.3, 'ap': 0.3, 'ip': 0.4,
        'max': 100, 'verbose': False, 'seed': None
    }

    # Update config with defaults and cast values
    for key in default_config:
        if key not in config:
            config[key] = default_config[key]

    # Set the seed if provided
    if config['seed'] is not None:
        seed(config['seed'])
    else:
        seed()

    # Create agents
    pop, inf = newPop(config)

    verbose_logs = []  # List to store verbose messages

    # Example of your simulation loop
    totinf = len(inf)
    curve = [totinf]
    rounds = 0

    while rounds < config['max']:
        inf = update(pop, inf, config)
        curve.append(len(inf))

        if config['verbose']:
            message = f"Day {rounds}: {len(inf)} infections"
            verbose_logs.append(message)  # Add verbose message to list

        if curve[-1] == 0:
            if config['verbose']:
                message = "Pandemic extinguished."
                verbose_logs.append(message)
            break

        newinf = set()
        for i in inf:
            num_interactions = randint(0, config['m'])

            # For each interaction, determine if a new infection occurs
            interactions = sample(range(len(pop)), num_interactions)
            for j in interactions:
                if infectious(pop[i]) and susceptible(pop[j]) and (
                    (exposed(pop[i], config) and flip(config['tpe'])) or (infected(pop[i], config) and flip(config['tpi']))
                ):
                    totinf += 1
                    pop[j]['state'] = config['di'] + config['de'] + 1
                    if flip(config['ap']):
                        pop[j]['sociso'] = 0
                    else:
                        pop[j]['sociso'] = config['ip']
                    newinf.add(j)

        inf.update(newinf)
        rounds += 1

    return curve, verbose_logs

######################################################################
# Additional helper functions to check agent states
def susceptible(agent):
    return agent['state'] == -1

def exposed(agent, config):
    return config['di'] < agent['state'] <= config['di'] + config['de']

def infected(agent, config):
    return 0 < agent['state'] <= config['di']

def infectious(agent):
    return agent['state'] > 0

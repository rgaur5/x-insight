import onnx
model = onnx.load("/Users/rishabhgaur/1twitextension/cautious-dollop/v1.onnx")

# Print information about input nodes
for input_node in model.graph.input:
    print("Input Node Name:", input_node.name)
    print("Input Node Shape:", input_node.type.tensor_type.shape.dim)
    print("Input Node Type:", input_node.type.tensor_type.elem_type)
    print()